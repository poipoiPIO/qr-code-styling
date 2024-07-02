import dotTypes from "../../../constants/dotTypes";
import { calculateStarPoints } from "../../../tools/calculateStarPoints";
import {
  DotType,
  GetNeighbor,
  RotateFigureArgsCanvas,
  BasicFigureDrawArgsCanvas,
  DrawArgsCanvas
} from "../../../types";

export default class QRDot {
  _context: CanvasRenderingContext2D;
  _type: DotType;

  constructor({ context, type }: { context: CanvasRenderingContext2D; type: DotType }) {
    this._context = context;
    this._type = type;
  }

  draw(x: number, y: number, size: number, getNeighbor: GetNeighbor): void {
    const context = this._context;
    const type = this._type;
    const drawFunctions: Record<string, (args: DrawArgsCanvas) => void> = {
      [dotTypes.star]: this._drawStar,
      [dotTypes.cross]: this._drawCross,
      [dotTypes.dots]: this._drawDot,
      [dotTypes.classy]: this._drawClassy,
      [dotTypes.classyRounded]: this._drawClassyRounded,
      [dotTypes.rounded]: this._drawRounded,
      [dotTypes.extraRounded]: this._drawExtraRounded,
      [dotTypes.square]: this._drawSquare
    };

    const drawFunction = drawFunctions[type] ?? this._drawSquare;
    drawFunction.call(this, { x, y, size, context, getNeighbor });
  }

  _rotateFigure({ x, y, size, context, rotation = 0, draw }: RotateFigureArgsCanvas): void {
    const cx = x + size / 2;
    const cy = y + size / 2;

    context.translate(cx, cy);
    rotation && context.rotate(rotation);
    draw();
    context.closePath();
    rotation && context.rotate(-rotation);
    context.translate(-cx, -cy);
  }

  _basicDot(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.arc(0, 0, size / 2, 0, Math.PI * 2);
      }
    });
  }

  _basicSquare(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.rect(-size / 2, -size / 2, size, size);
      }
    });
  }

  //if rotation === 0 - right side is rounded
  _basicSideRounded(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.arc(0, 0, size / 2, -Math.PI / 2, Math.PI / 2);
        context.lineTo(-size / 2, size / 2);
        context.lineTo(-size / 2, -size / 2);
        context.lineTo(0, -size / 2);
      }
    });
  }

  //if rotation === 0 - top right corner is rounded
  _basicCornerRounded(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.arc(0, 0, size / 2, -Math.PI / 2, 0);
        context.lineTo(size / 2, size / 2);
        context.lineTo(-size / 2, size / 2);
        context.lineTo(-size / 2, -size / 2);
        context.lineTo(0, -size / 2);
      }
    });
  }

  //if rotation === 0 - top right corner is rounded
  _basicCornerExtraRounded(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.arc(-size / 2, size / 2, size, -Math.PI / 2, 0);
        context.lineTo(-size / 2, size / 2);
        context.lineTo(-size / 2, -size / 2);
      }
    });
  }
  _basicCornersRounded(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.arc(0, 0, size / 2, -Math.PI / 2, 0);
        context.lineTo(size / 2, size / 2);
        context.lineTo(0, size / 2);
        context.arc(0, 0, size / 2, Math.PI / 2, Math.PI);
        context.lineTo(-size / 2, -size / 2);
        context.lineTo(0, -size / 2);
      }
    });
  }

  _basicCornersExtraRounded(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.arc(-size / 2, size / 2, size, -Math.PI / 2, 0);
        context.arc(size / 2, -size / 2, size, Math.PI / 2, Math.PI);
      }
    });
  }

  _drawDot({ x, y, size, context }: DrawArgsCanvas): void {
    this._basicDot({ x, y, size, context, rotation: 0 });
  }

  _drawCross(args: DrawArgsCanvas): void {
    const { size, context } = args;

    const x = 0 - size / 2 - 5;
    const y = x;

    const sizeCap = size / 2 - 5;

    this._rotateFigure({
      ...args,
      rotation: 0,
      draw: () => {
        const oldLineWidth = context.lineWidth;
        context.lineWidth = 24;

        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(sizeCap, sizeCap);
        context.moveTo(x, sizeCap);
        context.lineTo(sizeCap, y);
        context.stroke();

        context.lineWidth = oldLineWidth;
      }
    });
  }

  _drawStar(args: DrawArgsCanvas): void {
    const { size, context } = args;

    const x = -size;
    const y = -size;
    const cx = x + size;
    const cy = y + size;
    const outerRadius = size / 2;
    const innerRadius = outerRadius * 0.6;
    const points = calculateStarPoints(cx, cy, outerRadius, innerRadius, 5);
    const [x0, y0] = points[0];

    this._rotateFigure({
      ...args,
      rotation: 0,
      draw: () => {
        context.moveTo(x0, y0);
        points.forEach(([x, y]) => {
          context.lineTo(x, y);
        });
      }
    });
  }

  _drawSquare({ x, y, size, context }: DrawArgsCanvas): void {
    this._basicSquare({ x, y, size, context, rotation: 0 });
  }

  _drawRounded({ x, y, size, context, getNeighbor }: DrawArgsCanvas): void {
    const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
    const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
    const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
    const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;

    const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;

    if (neighborsCount === 0) {
      this._basicDot({ x, y, size, context, rotation: 0 });
      return;
    }

    if (neighborsCount > 2 || (leftNeighbor && rightNeighbor) || (topNeighbor && bottomNeighbor)) {
      this._basicSquare({ x, y, size, context, rotation: 0 });
      return;
    }

    if (neighborsCount === 2) {
      let rotation = 0;

      if (leftNeighbor && topNeighbor) {
        rotation = Math.PI / 2;
      } else if (topNeighbor && rightNeighbor) {
        rotation = Math.PI;
      } else if (rightNeighbor && bottomNeighbor) {
        rotation = -Math.PI / 2;
      }

      this._basicCornerRounded({ x, y, size, context, rotation });
      return;
    }

    if (neighborsCount === 1) {
      let rotation = 0;

      if (topNeighbor) {
        rotation = Math.PI / 2;
      } else if (rightNeighbor) {
        rotation = Math.PI;
      } else if (bottomNeighbor) {
        rotation = -Math.PI / 2;
      }

      this._basicSideRounded({ x, y, size, context, rotation });
      return;
    }
  }

  _drawExtraRounded({ x, y, size, context, getNeighbor }: DrawArgsCanvas): void {
    const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
    const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
    const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
    const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;

    const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;

    if (neighborsCount === 0) {
      this._basicDot({ x, y, size, context, rotation: 0 });
      return;
    }

    if (neighborsCount > 2 || (leftNeighbor && rightNeighbor) || (topNeighbor && bottomNeighbor)) {
      this._basicSquare({ x, y, size, context, rotation: 0 });
      return;
    }

    if (neighborsCount === 2) {
      let rotation = 0;

      if (leftNeighbor && topNeighbor) {
        rotation = Math.PI / 2;
      } else if (topNeighbor && rightNeighbor) {
        rotation = Math.PI;
      } else if (rightNeighbor && bottomNeighbor) {
        rotation = -Math.PI / 2;
      }

      this._basicCornerExtraRounded({ x, y, size, context, rotation });
      return;
    }

    if (neighborsCount === 1) {
      let rotation = 0;

      if (topNeighbor) {
        rotation = Math.PI / 2;
      } else if (rightNeighbor) {
        rotation = Math.PI;
      } else if (bottomNeighbor) {
        rotation = -Math.PI / 2;
      }

      this._basicSideRounded({ x, y, size, context, rotation });
      return;
    }
  }

  _drawClassy({ x, y, size, context, getNeighbor }: DrawArgsCanvas): void {
    const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
    const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
    const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
    const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;

    const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;

    if (neighborsCount === 0) {
      this._basicCornersRounded({ x, y, size, context, rotation: Math.PI / 2 });
      return;
    }

    if (!leftNeighbor && !topNeighbor) {
      this._basicCornerRounded({ x, y, size, context, rotation: -Math.PI / 2 });
      return;
    }

    if (!rightNeighbor && !bottomNeighbor) {
      this._basicCornerRounded({ x, y, size, context, rotation: Math.PI / 2 });
      return;
    }

    this._basicSquare({ x, y, size, context, rotation: 0 });
  }

  _drawClassyRounded({ x, y, size, context, getNeighbor }: DrawArgsCanvas): void {
    const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
    const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
    const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
    const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;

    const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;

    if (neighborsCount === 0) {
      this._basicCornersRounded({ x, y, size, context, rotation: Math.PI / 2 });
      return;
    }

    if (!leftNeighbor && !topNeighbor) {
      this._basicCornerExtraRounded({ x, y, size, context, rotation: -Math.PI / 2 });
      return;
    }

    if (!rightNeighbor && !bottomNeighbor) {
      this._basicCornerExtraRounded({ x, y, size, context, rotation: Math.PI / 2 });
      return;
    }

    this._basicSquare({ x, y, size, context, rotation: 0 });
  }
}
