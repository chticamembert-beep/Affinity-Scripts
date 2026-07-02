// Scale Down ×0.618 (1/φ — Golden Ratio) — from bounding box centre of selection
const { Document } = require('/document');
const { Transform } = require('/geometry');

const INV_PHI = 0.6180339887498949;

const doc = Document.current;
if (!doc) { console.log('No document open'); }
else {
    const sel = doc.selection;
    const count = sel.length;
    if (count === 0) {
        console.log('Nothing selected');
    } else {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (let i = 0; i < count; i++) {
            const item = sel.at(i);
            const node = item.node;
            if (node) {
                const box = node.getSpreadBaseBox(false);
                if (box) {
                    minX = Math.min(minX, box.x);
                    minY = Math.min(minY, box.y);
                    maxX = Math.max(maxX, box.x + box.width);
                    maxY = Math.max(maxY, box.y + box.height);
                }
            }
        }
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        const toOrigin = Transform.createTranslate(-cx, -cy);
        const scale    = Transform.createScale(INV_PHI, INV_PHI);
        const toCenter = Transform.createTranslate(cx, cy);
        const xf       = toCenter.multiply(scale.multiply(toOrigin));
        doc.applyTransform(xf, sel);
        console.log('Scaled down ×0.618 around centre (' + cx.toFixed(2) + ', ' + cy.toFixed(2) + ')');
    }
}
