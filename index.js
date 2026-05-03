const express = require('express');
const app = express();

const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.resolve("")));

let waitingPlayers = [];
let games = [];
let pendingResets = {}; // لتخزين طلبات reset المؤقتة { gameId: { requesterId, timeout } }

const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function checkWinner(board) {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return {
                winner: board[a],
                pattern: pattern
            };
        }
    }

    if (board.every(cell => cell !== null)) {
        return { winner: 'draw' };
    }

    return null;
}

io.on('connection', (socket) => {

    // البحث عن لاعب
    socket.on('find', (data) => {

        if (!data.name) return;

        waitingPlayers.push({
            name: data.name,
            id: socket.id
        });

        // لو فيه 2 لاعبين
        if (waitingPlayers.length >= 2) {

            let p1 = waitingPlayers.shift();
            let p2 = waitingPlayers.shift();

            let game = {
                id: Date.now().toString(),

                p1: {
                    name: p1.name,
                    id: p1.id,
                    value: 'X',
                    moves: [],
                    score: 0
                },

                p2: {
                    name: p2.name,
                    id: p2.id,
                    value: 'O',
                    moves: [],
                    score: 0
                },
                nextStarter: 'X',
                turn: 'X',
                resetVotes: [],
                board: Array(9).fill(null)
            };

            games.push(game);

            io.to(p1.id).emit('startGame', {
                game,
                yourId: p1.id
            });

            io.to(p2.id).emit('startGame', {
                game,
                yourId: p2.id
            });
        }
    });

    socket.on('playing', (data) => {

        let game = games.find(g =>
            g.p1.id === socket.id || g.p2.id === socket.id
        );

        if (!game) return;

        let player;
        let opponent;

        if (game.p1.id === socket.id) {
            player = game.p1;
            opponent = game.p2;
        } else {
            player = game.p2;
            opponent = game.p1;
        }

        if (player.value !== game.turn) {
            socket.emit('notYourTurn');
            return;
        }

        if (game.board[data.index] !== null) {
            socket.emit('cellTaken');
            return;
        }

        game.board[data.index] = player.value;

        io.to(game.p1.id).emit('updateGame', game);
        io.to(game.p2.id).emit('updateGame', game);

        let result = checkWinner(game.board);

        if (result) {

            if (result.winner === 'draw') {
                io.to(game.p1.id).emit('gameOver', {
                    result: 'draw',
                    game
                });
                io.to(game.p2.id).emit('gameOver', {
                    result: 'draw',
                    game
                });
            } else {

                if (result.winner === 'X') {
                    game.p1.score++;
                    game.nextStarter = 'X';
                } else if (result.winner === 'O') {
                    game.p2.score++;
                    game.nextStarter = 'O';
                }
                io.to(game.p1.id).emit('gameOver', {
                    result: result.winner,
                    winner: result,
                    game
                });

                io.to(game.p2.id).emit('gameOver', {
                    result: result.winner,
                    winner: result,
                    game
                });
            }

            return;
        }

        player.moves.push(data.index);

        game.turn = game.turn === 'X' ? 'O' : 'X';
        io.to(game.p1.id).emit('updateGame', game);
        io.to(game.p2.id).emit('updateGame', game);
    });

    socket.on('disconnect', () => {
        waitingPlayers = waitingPlayers.filter(p => p.id !== socket.id);

        games = games.filter(game => {
            if (game.p1.id === socket.id || game.p2.id === socket.id) {
                let other = game.p1.id === socket.id ? game.p2 : game.p1;

                io.to(other.id).emit('opponentLeft');
                return false;
            }
            return true;
        });
    });

    socket.on('playAgain', () => {

        let game = games.find(g =>
            g.p1.id === socket.id || g.p2.id === socket.id
        );

        if (!game) return;

        // reset board
        game.board = Array(9).fill(null);
        game.turn = game.nextStarter;

        // امسح الحركات
        game.p1.moves = [];
        game.p2.moves = [];

        // ابعت تحديث
        io.to(game.p1.id).emit('updateGame', game);
        io.to(game.p2.id).emit('updateGame', game);
    });

    socket.on('requestReset', () => {
        let game = games.find(g => g.p1.id === socket.id || g.p2.id === socket.id);
        if (!game) return;
        let opponent = (game.p1.id === socket.id) ? game.p2 : game.p1;
        if (pendingResets[game.id]) {
            clearTimeout(pendingResets[game.id].timeout);
            delete pendingResets[game.id];
        }
        pendingResets[game.id] = {
            requesterId: socket.id,
            timeout: setTimeout(() => {
                io.to(socket.id).emit('resetTimeout');
                delete pendingResets[game.id];
            }, 30000)
        };
        io.to(opponent.id).emit('resetRequest', { gameId: game.id });
    });

    socket.on('requestReset', () => {
        console.log("requestReset from", socket.id);
        let game = games.find(g => g.p1.id === socket.id || g.p2.id === socket.id);
        if (!game) return;

        let opponent = (game.p1.id === socket.id) ? game.p2 : game.p1;

        // تسجيل الطلب مع مهلة 30 ثانية
        if (pendingResets[game.id]) {
            // يوجد طلب سابق، نلغيه و نبدأ جديداً
            clearTimeout(pendingResets[game.id].timeout);
            delete pendingResets[game.id];
        }

        pendingResets[game.id] = {
            requesterId: socket.id,
            timeout: setTimeout(() => {
                // انتهاء المهلة: نرسل للطالب أن الخصم لم يرد
                io.to(socket.id).emit('resetTimeout');
                delete pendingResets[game.id];
            }, 30000)
        };

        // إرسال طلب للخصم
        io.to(opponent.id).emit('resetRequest', { gameId: game.id });
    });

    socket.on('resetResponse', (data) => {
        console.log("resetResponse", data);
        const { gameId, accept } = data;
        const pending = pendingResets[gameId];
        if (!pending) {
            // لا يوجد طلب نشط
            return;
        }

        clearTimeout(pending.timeout);
        delete pendingResets[gameId];

        const game = games.find(g => g.id === gameId);
        if (!game) return;

        if (!accept) {
            // الخصم رفض
            io.to(game.p1.id).emit('resetDeclined');
            io.to(game.p2.id).emit('resetDeclined');
            return;
        }

        // قبول الخصم: نقوم بإعادة الضبط فوراً
        game.board = Array(9).fill(null);
        game.turn = 'X';
        game.nextStarter = 'X';
        game.p1.moves = [];
        game.p2.moves = [];
        game.p1.score = 0;
        game.p2.score = 0;

        // if (game.resetVotes) delete game.resetVotes;

        io.to(game.p1.id).emit('gameReset', game);
        io.to(game.p2.id).emit('gameReset', game);
    });
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
const PORT = process.env.PORT || 8080;
server.listen(PORT,'0.0.0.0' ,() => {
    console.log(`Listening on port ${PORT}`);
});