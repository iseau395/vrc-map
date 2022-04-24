import App from './App.svelte';
import { GameType } from './util/constants';

new App({
    target: document.body,
    context: new Map([
        [Symbol.for("game"), GameType.TIPPING_POINT]
    ])
});