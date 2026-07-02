// Centre selected object(s) on the active artboard (both axes)
const { Document } = require('/document');
const { Transform } = require('/geometry');

function findArtboardForBox(spread, selBox) {
    const artboards = spread.artboards;
    if (artboards.length === 0) return null;
    if (artboards.length === 1) return artboards[0];

    const selCx = selBox.x + selBox.width / 2;
    const selCy = selBox.y + selBox.height / 2;

    for (const ab of artboards) {
        const box = ab.spreadBaseBox;
        if (selCx >= box.x && selCx <= box.x + box.width &&
            selCy >= box.y && selCy <= box.y + box.height) {
            return ab;
        }
    }
    // fallback: first artboard on the spread
    return artboards[0];
}

const doc = Document.current;
if (!doc) {
    console.log('No document open');
} else {
    const sel = doc.selection;
    const count = sel.length;
    if (count === 0) {
        console.log('Nothing selected');
    } else {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (let i = 0; i < count; i++) {
            const node = sel.at(i).node;
            if (node) {
                const box = node.getSpreadBaseBox(false);
                minX = Math.min(minX, box.x);
                minY = Math.min(minY, box.y);
                maxX = Math.max(maxX, box.x + box.width);
                maxY = Math.max(maxY, box.y + box.height);
            }
        }
        const selBox = { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
        const selCx = minX + selBox.width / 2;
        const selCy = minY + selBox.height / 2;

        const spread = doc.currentSpread;
        const artboard = findArtboardForBox(spread, selBox);
        if (!artboard) {
            console.log('No artboard found on this spread');
        } else {
            const abBox = artboard.spreadBaseBox;
            const abCx = abBox.x + abBox.width / 2;
            const abCy = abBox.y + abBox.height / 2;

            const dx = abCx - selCx;
            const dy = abCy - selCy;

            const xf = Transform.createTranslate(dx, dy);
            doc.applyTransform(xf, sel);
            console.log('Centred on artboard "' + artboard.description + '" (dx=' + dx.toFixed(2) + ', dy=' + dy.toFixed(2) + ')');
        }
    }
}
