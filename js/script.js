const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color');
const lineWidth = document.getElementById('lineWidth');
const clearBtn = document.getElementById('btn');
const saveBtn = document.getElementById('save');

// --- COLOQUE AQUI: Inicializa o fundo branco ---
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
// -----------------------------------------------

let painting = false;

function getPointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // Ajuste importante para o zoom do navegador no mobile
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

function startPosition(e) {
    painting = true;
    draw(e);
}

function finishedPosition() {
    painting = false;
    ctx.beginPath();
}

function draw(e) {
    if (!painting) return;
    if (e.cancelable) e.preventDefault();

    const pos = getPointerPos(e);

    ctx.lineWidth = lineWidth.value;
    ctx.lineCap = 'round';
    ctx.strokeStyle = colorPicker.value;

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', finishedPosition);
canvas.addEventListener('mousemove', draw);

canvas.addEventListener('touchstart', (e) => {
    startPosition(e);
}, { passive: false });

canvas.addEventListener('touchend', finishedPosition);

canvas.addEventListener('touchmove', (e) => {
    draw(e);
}, { passive: false });

// Limpar tela (Ajustado para voltar a ser branco)
clearBtn.addEventListener('click', () => {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// Salvar imagem
saveBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'meu-desenho'; // Nome personalizado!
    link.href = canvas.toDataURL("image/png");
    link.click();
});