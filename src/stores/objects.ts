import { writable } from 'svelte/store';
import type { Point } from '../map/var';
import { GameObject, Mogo, Ring } from '../map/gameobject';

const FIELD_SIDE = 713.74;

export const points = writable(new Array<Point>());
export const gameobjects = writable<GameObject[]>([
    new Mogo(FIELD_SIDE / 2, FIELD_SIDE / 4, 180, 0),
    new Mogo(FIELD_SIDE / 2, (FIELD_SIDE / 4) * 2, 0, 0),
    new Mogo(FIELD_SIDE / 2, (FIELD_SIDE / 4) * 3, 0, 0),
    new Mogo((FIELD_SIDE / 12) * 3, (FIELD_SIDE / 12) * 11, 270, 1),
    new Mogo((FIELD_SIDE / 12) * 1, (FIELD_SIDE / 6) * 2, 0, 1),
    new Mogo((FIELD_SIDE / 12) * 9, (FIELD_SIDE / 12) * 1, 90, 2),
    new Mogo((FIELD_SIDE / 12) * 11, (FIELD_SIDE / 3) * 2, 180, 2),
    new Ring(FIELD_SIDE / 2, 29.708333333333332),
    new Ring(FIELD_SIDE / 2, 59.416666666666664),
    new Ring(FIELD_SIDE / 2, 89.125),
    new Ring(FIELD_SIDE / 2, FIELD_SIDE / 6),
    new Ring(386.2083333333333, FIELD_SIDE / 6),
    new Ring(415.91666666666663, FIELD_SIDE / 6),
    new Ring(445.625, FIELD_SIDE / 6),
    new Ring(475.3333333333333, FIELD_SIDE / 6),
    new Ring(FIELD_SIDE / 2, 237.66666666666666),
    new Ring(FIELD_SIDE / 2, 267.375),
    new Ring(FIELD_SIDE / 2, 297.0833333333333),
    new Ring(FIELD_SIDE / 2, 475.3333333333333),
    new Ring(FIELD_SIDE / 2, 445.625),
    new Ring(FIELD_SIDE / 2, 445.625),
    new Ring(FIELD_SIDE / 2, 415.91666666666663),
    new Ring(FIELD_SIDE / 2, 594.1666666666666),
    new Ring(FIELD_SIDE / 2, 623.875),
    new Ring(FIELD_SIDE / 2, 653.5833333333333),
    new Ring(FIELD_SIDE / 2, 683.2916666666666),
    new Ring(326.79166666666663, 594.1666666666666),
    new Ring(297.0833333333333, 594.1666666666666),
    new Ring(267.375, 594.1666666666666),
    new Ring(237.66666666666666, 594.1666666666666),
    new Ring(475.3333333333333, FIELD_SIDE / 2),
    new Ring(490.1875, FIELD_SIDE / 2),
    new Ring(475.3333333333333, 341.6458333333333),
    new Ring(460.47916666666663, FIELD_SIDE / 2),
    new Ring(475.3333333333333, 371.35416666666663),
    new Ring(475.3333333333333, 475.3333333333333),
    new Ring(490.1875, 475.3333333333333),
    new Ring(475.3333333333333, 460.47916666666663),
    new Ring(460.47916666666663, 475.3333333333333),
    new Ring(475.3333333333333, 490.1875),
    new Ring(237.66666666666666, FIELD_SIDE / 2),
    new Ring(252.52083333333331, FIELD_SIDE / 2),
    new Ring(222.8125, FIELD_SIDE / 2),
    new Ring(237.66666666666666, 341.6458333333333),
    new Ring(237.66666666666666, 371.35416666666663),
    new Ring(237.66666666666666, 237.66666666666666),
    new Ring(237.66666666666666, 222.8125),
    new Ring(252.52083333333331, 237.66666666666666),
    new Ring(237.66666666666666, 252.52083333333331),
    new Ring(222.8125, 237.66666666666666),
]);