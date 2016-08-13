var canvas;

function load(src, callback) {
    httpGet(
        src,
        null,
        'text',
        function (patch) { callback(patch); },
        function (err) { console.log(err); }
    );
}

function setup() {
    load('main.pd', function (mainPatch) {
        load('sub.pd', function (subPatch) {
            Pd.registerAbstraction('sub', subPatch);
            Pd.loadPatch(mainPatch);
            Pd.start();
        });
    });
    createCanvas(windowWidth, windowHeight).elt;
    textSize(32);
    colorMode(HSB, 100);
    blendMode(ADD);
    noStroke();
}

function draw() {
    var x, y, w = 100;
    x = map(mouseY, 0, height, 10, -10);
    y = max(abs(map(mouseX, 0, width, -5200, 5200)) - 200, 0) + 50;
    Pd.send('rate', [x]);
    Pd.send('length', [y]);
    clear();
    background(map(x, -4, 4, 0, 80), 80, 80);
    fill(map(x, -4, 4, 0, 80), 80, 80, 10);
    for (var i = 1; i < 10; i += 1) {
        rect(0,  i * map(y, 0, 1000, 0, 30) + height / 2 - w / 2, width, 100);
        rect(0, -i * map(y, 0, 1000, 0, 30) + height / 2 - w / 2, width, -100);
    }
    fill(0, 0, 100);
    text(['Playback rate:', x.toFixed(3)].join(' '), 100, 100);
    text(['Window size:',   y.toFixed(3), 'ms.'].join(' '), 100, 140);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

//EOF