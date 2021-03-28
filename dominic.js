"use strict";

// Sequence of events:
// 1. User clicks on a circle.
//    * mousedown fires
//    * selected is set to that circle.
// 2. User moves mouse to another circle.
//    * mouseenter fires
//    * the path between the two circles is drawn
//    * the new partition is worked out and boxes are shaded as appropriate
// 3a. (One possibility) User moves mouse out of the circle again.
//    * mouseleave fires
//    * the path is deleted
//    * the boxes are set so that they are no longer shaded, keeping the previous partition
//    * the next step will be 2 again
// 3b. (another possibility) User lifts the mouse, ending the drag.
//    * mouseup fires
//     * the path is deleted
//    * the boxes are set so that they are no longer shaded, changing the partition
//    * the circles change colour
//    * nothing is selected now, so selected is set to undefined

function makeElement(parent, type, attrs) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", type);
  for (const attr of Object.keys(attrs)) {
    element.setAttribute(attr, attrs[attr]);
  }
  parent.appendChild(element);
  return element;
}

const root = document.getElementById("root");
const partition = document.getElementById("partition");

let selected;
let path;

// Edge case where the user drags a circle to
// something that's not a circle.
document.addEventListener("mouseup", () => (selected = undefined));

// cells is an array of arrays, initially empty,
// but it will soon hold rows of boxes.
const cells = [[], [], [], [], [], [], [], [], [], []];
const circles = [];

function toPartition(electrons) {
  let height = 10;
  const result = [];
  for (const electron of electrons) {
    if (electron) {
      result.push(height);
    } else {
      height--;
    }
  }
  return result;
}

// Wrapper class for an individual circle element.
class Circle {
  constructor(element) {
    // Set up functions to handle dragging the circles.
    // Binding is neccessary to prevent the value of this changing.
    this.element = element;
    element.addEventListener("mousedown", this.onmousedown.bind(this));
    element.addEventListener("mouseup", this.onmouseup.bind(this));
    element.addEventListener("mouseenter", this.onmouseenter.bind(this));
    element.addEventListener("mouseleave", this.onmouseleave.bind(this));

    this.cells = cells;

    // Add the circle to the array of circles.
    this.index = circles.length;
    circles.push(this);
  }

  fill() {
    this.element.setAttribute("fill", "black");
    this.filled = true;
  }

  unfill() {
    this.element.setAttribute("fill", "white");
    this.filled = false;
  }

  compareFills(callback) {
    if (selected) {
      if (this.filled && !selected.filled) {
        callback(this, selected);
      } else if (!this.filled && selected.filled) {
        callback(selected, this);
      }
    }
  }

  removeDashes(filled, unfilled) {
    if (filled.index > unfilled.index) {
      for (const row of cells) {
        const newRow = row.slice();
        for (const cell of newRow) {
          if (cell.dashed) {
            row.pop();
            partition.removeChild(cell);
          }
        }
      }
    } else if (filled.index < unfilled.index) {
      for (const row of cells) {
        for (const cell of row) {
          if (cell.dashed) {
            cell.dashed = false;
            cell.removeAttribute("stroke-dasharray");
          }
        }
      }
    }

    root.removeChild(path);
    path = undefined;
  }

  onmousedown(event) {
    event.stopPropagation();
    selected = this;
  }

  onmouseenter(event) {
    this.compareFills((filled, unfilled) => {
      const electrons = circles.map((el) => el.filled);
      electrons[filled.index] = false;
      electrons[unfilled.index] = true;
      const desired = toPartition(electrons);
      for (let i = 0; i < 10; i++) {
        if (cells[i].length < desired[i]) {
          for (let j = cells[i].length; j < desired[i]; j++) {
            // Note that stroke-dasharray controls whether the box is shaded
            const cell = makeElement(partition, "rect", {
              fill: "none",
              stroke: "black",
              "stroke-width": 0.25,
              "stroke-dasharray": 1,

              width: 7,
              height: 7,
              x: 7 * i,
              y: 63 - 7 * j,
            });
            cell.dashed = true;
            cells[i].push(cell);
          }
        } else if (cells[i].length > desired[i]) {
          for (let j = desired[i]; j < cells[i].length; j++) {
            const cell = cells[i][j];
            cell.setAttribute("stroke-dasharray", 1);
            cell.dashed = true;
          }
        }
      }

      const xThis = 2 + this.index * 5;
      const xSelected = 2 + selected.index * 5;

      // Setting pointer-events prevents the path from causing problems
      // since it is partly on top of the circle.
      // d controls the shape of the path: the code says to move the pen
      // to this and draw a quadratic bezier curve to selected.
      path = makeElement(root, "path", {
        "pointer-events": "none",

        fill: "none",
        stroke: "black",
        "stroke-width": "0.5",
        "stroke-dasharray": 1,

        d: `M ${xThis},60
        Q ${(xThis + xSelected) / 2},70,${xSelected},60`,
      });
    });
  }

  onmouseleave(event) {
    this.compareFills(this.removeDashes);
  }

  onmouseup(event) {
    event.stopPropagation();

    this.compareFills((filled, unfilled) => {
      filled.unfill();
      unfilled.fill();

      this.removeDashes(unfilled, filled);
    });

    selected = undefined;
  }
}

for (let i = 0; i < 20; i++) {
  makeElement(root, "line", {
    stroke: "black",
    "stroke-width": 0.1,
    "stroke-dasharray": 1,

    y1: -20,
    y2: 60,
    x1: 2 + i * 5,
    x2: 2 + i * 5
  })

  const element = makeElement(root, "circle", {
    stroke: "black",
    "stroke-width": 0.25,

    r: 2,
    cy: 60,
    cx: 2 + i * 5,
  });

  const circle = new Circle(element);
  if (i < 10) {
    circle.unfill();
  } else {
    circle.fill();
  }
}
