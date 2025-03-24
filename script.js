function makeDraggable(evt) {
    var svg = evt.target;
    var selectedElement = false;
    var offset;

    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);

    function startDrag(evt) {
        if (evt.target.classList.contains('draggable-x') || evt.target.classList.contains('draggable-y')) {
            selectedElement = evt.target;
            offset = getMousePosition(evt);
            offset.x -= parseFloat(selectedElement.getAttribute('cx'));
            offset.y -= parseFloat(selectedElement.getAttribute('cy'));
        }
    }

    function drag(evt) {
        if (selectedElement) {
            evt.preventDefault();
            var coord = getMousePosition(evt);
            var horizontalCircle = document.getElementById('horizontal-circle');
            var verticalCircle = document.getElementById('vertical-circle');
            var movingRect = document.getElementById('moving-rect');
            var verticalRect = document.getElementById('vertical-rect');

            if (selectedElement.classList.contains('draggable-x')) {
                horizontalCircle.setAttribute('cx', coord.x - offset.x);
            } else if (selectedElement.classList.contains('draggable-y')) {
                verticalCircle.setAttribute('cy', coord.y - offset.y);
            }

            var hx = parseFloat(horizontalCircle.getAttribute('cx'));
            var hy = parseFloat(horizontalCircle.getAttribute('cy'));
            var vx = parseFloat(verticalCircle.getAttribute('cx'));
            var vy = parseFloat(verticalCircle.getAttribute('cy'));

            // Update the horizontal rectangle
            movingRect.setAttribute('x', Math.min(hx, vx));
            movingRect.setAttribute('y', hy - parseFloat(movingRect.getAttribute('height')) / 2);
            movingRect.setAttribute('width', Math.abs(hx - vx));

            // Update the vertical rectangle
            verticalRect.setAttribute('x', vx - parseFloat(verticalRect.getAttribute('width')) / 2);
            verticalRect.setAttribute('y', Math.min(hy, vy));
            verticalRect.setAttribute('height', Math.abs(hy - vy));

            updateHypotenuse();
            updateLegsAndHypotenuse();
        }
    }

    function endDrag(evt) {
        selectedElement = null;
    }

    function getMousePosition(evt) {
        var CTM = svg.getScreenCTM();
        return {
            x: (evt.clientX - CTM.e) / CTM.a,
            y: (evt.clientY - CTM.f) / CTM.d
        };
    }

    function updateHypotenuse() {
        var x1 = parseFloat(document.getElementById('horizontal-circle').getAttribute('cx'));
        var y1 = parseFloat(document.getElementById('horizontal-circle').getAttribute('cy'));
        var x2 = parseFloat(document.getElementById('vertical-circle').getAttribute('cx'));
        var y2 = parseFloat(document.getElementById('vertical-circle').getAttribute('cy'));
        var hypotenuse = document.getElementById('hypotenuse');
        hypotenuse.setAttribute('x1', x1);
        hypotenuse.setAttribute('y1', y1);
        hypotenuse.setAttribute('x2', x2);
        hypotenuse.setAttribute('y2', y2);
    }

    function updateLegsAndHypotenuse() {
        var leg1 = parseFloat(document.getElementById('moving-rect').getAttribute('width')) / 100;
        var leg2 = parseFloat(document.getElementById('vertical-rect').getAttribute('height')) / 100;
        var hyp = Math.sqrt(leg1 * leg1 + leg2 * leg2).toFixed(4);

        console.log('Leg 1:', leg1);
        console.log('Leg 2:', leg2);
        console.log('Hypotenuse:', hyp);

        document.getElementById('leg1').innerHTML = leg1.toFixed(2);
        document.getElementById('leg2').innerHTML = leg2.toFixed(2);
        document.getElementById('hyp').innerHTML = hyp;
    }
}