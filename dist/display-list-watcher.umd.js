(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require("phaser")) : typeof define === "function" && define.amd ? define(["phaser"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.DisplayListWatcher = factory(global.Phaser));
})(this, function(Phaser) {
  "use strict";
  const fontData = {
    chars: `ABCDEFGHIJKLMNOPQRSTUVWXYZ 12345abcdefghijklmnopqrstuvwxyz 67890{}[]()<>$*-+=/#_%^@\\&|~?'" !,.;:`,
    charsPerRow: 32,
    height: 13,
    image: "proggy_clean_inv",
    offset: { x: 5, y: 24 },
    spacing: { x: 0, y: 0 },
    width: 7
  };
  const fontImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQ4AAABKCAMAAAB90UpZAAABEVBMVEUAAADUUP1/f398e3x+fn58fHx8fH3///97e3t6e3t5eXl3d3d2dXV2dXZzc3NzdHNxcnFxcXFvb29sbGxtbW1qamprampoaGhmZWVlZmVjY2JjY2NgX2BgYGBeXV5dXl1aWlpYWFdYV1dVVFVUVFVSUVJSUlJPT05PTk9MTEtMTExISUlISUhGRkZGRkVDQ0NCQ0M/QD9AP0A9PD06OTo6Ojk2Njc2Nzc0NDQ0MzMwMDEwMDAuLi0tLS4rKysqKisnKCcnJyckJSQlJSUiIiIfHx8gHx8cHB0ZGRkaGhoXGBcXFxcUFRUVFRQTEhISEhMQEBAODg4ODQ4MCwsMDAwKCQoKCgoICAgGBgYGBQYFBATgX/oDAAADz0lEQVR4AeyVB1LEMAxFRRW9d+5/T8gfj/chNOuEXvRIpEiORfa72QdRFEVRbEx0Jx+zU8JkBbN8VVadf7McMpkzOlmGdCwzafJXZgfkaBOAjbkc6P8X5BhMEpg5s0Pmr8iR7R1BDjTCUcAp+R8piqIoNkGxkqPYepZjRfGJcpQcJUfJUXKUHCVHsb2NoNjZ7Y/uMnJ66JHLN9fbzGSQ60lnweaT/4BI3kXrjrd6TUTCOv2juxP46lns7Qc5eDcrZ92hzZzpfqdy4NLNKBSLcvhrOeh6HsXYeQEHB3LZ58XBTlwiB1KOPxlInESoyja3cGVqsADrLJXj8DDIMRGKYs3wY0Q6aZbLYe65HKhgno4OA84K/iKby9GxNaCDj2aHe7ZYsHgpcDNBW0Sc7zTs6mtWSpbM59GQk1PW84EcSI4XSy7HmtnsmRxh90FxgCTkEMvkODtP5fiQrVQWI+toG2+ljPJXCJPOR0ZjLi6CHBPpQYuiyUErG6pEOWRYhfKzAKNcDgx9j7qzVQujOVxe2Tfi9sO4vkFQ3N4iKO7uERQPj6PVzAx3JY8PL06ZJ/bMArl2GIaiHjyL+FBm7isz739HZYiuNB67gaIfhpToxJJ1Hb4mjr//KnCQ2VMZDZxbIcnIoj9F7f/YN8Ch9VfwU9jGx20g4MgSbaO5pIK4OeDbPQMrSU+kjpBE66hsVxptcExMWsbkABMW41qkywJZm7hSNSkONRTqeysBMVQoxzE1bUxan/RWlOAgleKwHFAcykLrUo1iX94DtThmZkMBhr/hZTioxWFcEhyqaNXzGEcbzTI3LziGDhb1SbwzihaDKsCBN1SHY2FRgiWTShM+rGJF63HECVlM+n0C/EatSUGEWTImy9rScmcDItWH8umU38pqNxcEpG+AY229bv+M6wPhoE8BsLHZWPhto5Gt+9FspDPcnfdv9H+ZEKCXkNna1nPTXJBF3h3JqAtYxhAJYnyUxDi6YrOz2xYHBcGsLujUui8cCHsOfePY2y/AYZYkrIhR4XEAQIjjyRweR1XIaaMe1cFhPQ7RsBj37I4A7oY2FuRJmz5b9Q/Ie8ZxdOzmryCLAyT5inqXmjEX7sQ4VL5KzdlnKXJy2q53GKEV9w5ZcNnDuJyIZdpAOM7OW+aOlIgvvaRzqF2Po66hP7WoLi5bjiwApReJrETNmHm0+t7RHsfVVf91B4ovS5AWIUDbALq+aVGV9t4YmEa6az++CQCGgQAGht2nd1f+QLwKhG67CETzgmjdEO0HovNCdN+InhfR9yNKGVEpiGpD1PskGtJlPAcJ+yNWAAAAAElFTkSuQmCC";
  const twoSpaces = / {2,}/g;
  const GetObjectDescription = (obj, precision = 1) => {
    const { type } = obj;
    let output;
    let count = null;
    if (type === "Blitter") {
      count = obj.children.list.length;
    } else if (type === "ParticleEmitter") {
      count = obj.getParticleCount();
    } else if (type === "SpriteGPULayer") {
      count = obj.memberCount;
    } else if (type === "TilemapLayer" || type === "TilemapGPULayer") {
      count = obj.tilesTotal;
    } else if (obj.list) {
      count = obj.list.length;
    }
    const countStr = count === null ? "" : `(${count})`;
    if (type === "DisplayList") {
      output = `${obj.type} ${obj.name} ${countStr}`;
    } else {
      const visible = obj.visible ? "+" : "-";
      const pos = typeof obj.x === "number" ? `(${obj.x.toFixed(precision)}, ${obj.y.toFixed(precision)})` : "";
      output = `${visible} ${obj.type} ${obj.name} ${pos} ${obj.depth.toFixed(precision)} ${countStr}`;
    }
    output = output.replace(twoSpaces, " ").trimEnd();
    return output;
  };
  const indentMap = {};
  for (let i = 0; i <= 11; i++) {
    indentMap[i] = " ".repeat(2 * i);
  }
  const WalkDisplayListObj = (obj, output = [], currentDepth = 0, maxDepth = 10, maxLength = 1e3) => {
    output.push((indentMap[currentDepth] ?? "! ") + GetObjectDescription(obj));
    const { list } = obj;
    if (list) {
      currentDepth += 1;
      const listLength = list.length;
      const currentIndent = indentMap[currentDepth] ?? "! ";
      if (currentDepth > maxDepth) {
        if (listLength > 0) {
          output.push(`${currentIndent}[ ${listLength} more ... ]`);
        }
        return output;
      }
      let remainingChildren = listLength;
      for (const child of list) {
        WalkDisplayListObj(child, output, currentDepth, maxDepth, maxLength);
        remainingChildren -= 1;
        if (output.length >= maxLength) {
          if (remainingChildren > 0) {
            output.push(`${currentIndent}[ ${remainingChildren} more ... ]`);
          }
          return output;
        }
      }
    }
    return output;
  };
  const { POSITIVE_INFINITY } = Number;
  const TextureEvents = Phaser.Textures.Events;
  const CacheEvents = Phaser.Cache.Events;
  const CoreEvents = Phaser.Core.Events;
  const KeyboardEvents = Phaser.Input.Keyboard.Events;
  const SceneEvents = Phaser.Scenes.Events;
  const { KeyCodes } = Phaser.Input.Keyboard;
  const ParseRetroFont = Phaser.GameObjects.RetroFont.Parse;
  const fontTextureKey = fontData.image;
  const fontKey = fontData.image;
  class DisplayListWatcher extends Phaser.Plugins.ScenePlugin {
    constructor(scene, pluginManager) {
      super(scene, pluginManager);
      this.camera = null;
      this.controls = null;
      this.modKey = null;
      this.text = null;
    }
    boot() {
      const { cache, events, settings, textures } = this.systems;
      if (!textures.exists(fontTextureKey)) {
        this.addImage(fontKey, fontImage);
      }
      textures.once(`${TextureEvents.ADD_KEY}${fontTextureKey}`, () => {
        if (cache.bitmapFont.has(fontKey)) {
          return;
        }
        cache.bitmapFont.add(fontKey, ParseRetroFont(this.scene, fontData));
      });
      if (settings.key === "__SYSTEM") {
        return;
      }
      events.on(SceneEvents.START, this.start, this);
      events.on(SceneEvents.SHUTDOWN, this.stop, this);
      events.on(SceneEvents.DESTROY, this.destroy, this);
      if (settings.isBooted) {
        this.start();
      }
    }
    // For Phaser v3.87. Avoids errors from duplicate keys.
    addImage(key, url) {
      const { textures } = this.systems;
      if (textures.exists(key)) {
      }
      const image = new Image();
      image.onload = function onload() {
        image.onload = null;
        if (textures.exists(key)) {
          return;
        }
        textures.addImage(key, image);
      };
      image.src = url;
    }
    onFontCacheAdded(cache, key) {
      if (key !== fontKey) {
        return;
      }
      cache.events.off(CacheEvents.ADD, this.onFontCacheAdded, this);
      this.start();
    }
    start() {
      const { game } = this;
      const { cache, events, input, make, renderer } = this.systems;
      const fontCache = cache.bitmapFont;
      const keyboard = input == null ? void 0 : input.keyboard;
      const { width, height } = this.systems.scale;
      if (!fontCache.exists(fontKey)) {
        fontCache.events.on(CacheEvents.ADD, this.onFontCacheAdded, this);
        return;
      }
      game.events.on(CoreEvents.POST_RENDER, this.render, this);
      this.camera = new Phaser.Cameras.Scene2D.Camera(0, 0, width, height).setBounds(0, 0, POSITIVE_INFINITY, POSITIVE_INFINITY).setRoundPixels(true);
      if (keyboard) {
        events.on(SceneEvents.UPDATE, this.update, this);
        this.addKeyboardControls(keyboard);
      }
      this.text = make.bitmapText({ font: fontKey }, false);
      this.renderText = renderer.type === Phaser.WEBGL ? this.text.renderWebGL : this.text.renderCanvas;
    }
    stop() {
      const { game } = this;
      const { cache, events, input, settings } = this.systems;
      const keyboard = input == null ? void 0 : input.keyboard;
      cache.bitmapFont.events.off(CacheEvents.ADD, this.onFontCacheAdded, this);
      events.off(SceneEvents.UPDATE, this.update, this);
      game.events.off(CoreEvents.POST_RENDER, this.render, this);
      if (keyboard) {
        keyboard.off(KeyboardEvents.ANY_KEY_DOWN, this.onAnyKeyDown, this);
      }
      if (this.camera) {
        this.camera.destroy();
      }
      if (this.controls) {
        const { left, right, up, down } = this.controls;
        keyboard.removeKey(left);
        keyboard.removeKey(right);
        keyboard.removeKey(up);
        keyboard.removeKey(down);
      }
      if (this.text) {
        this.text.destroy();
      }
      this.camera = null;
      this.controls = null;
      this.modKey = null;
    }
    update(_time, delta) {
      if (this.modKey.isDown) {
        this.controls.update(delta);
      }
    }
    render() {
      if (!this.text.visible) {
        return;
      }
      const { displayList, renderer, scenePlugin, settings } = this.systems;
      const x = 256 * scenePlugin.getIndex(this.scene);
      const y = 0;
      const output = WalkDisplayListObj(
        {
          name: settings.key,
          type: "DisplayList",
          list: displayList.list
        },
        [],
        0
      );
      this.text.setPosition(x, y).setText(output);
      this.camera.setBounds(0, 0, POSITIVE_INFINITY, this.text.height);
      this.camera.preRender();
      this.renderText(renderer, this.text, this.camera);
      if (renderer.type === Phaser.WEBGL) {
        renderer.flush();
      }
    }
    destroy() {
      this.stop();
      this.systems.events.off(SceneEvents.START, this.start, this).off(SceneEvents.SHUTDOWN, this.stop, this).off(SceneEvents.DESTROY, this.destroy, this);
      this.pluginManager = null;
      this.game = null;
      this.scene = null;
      this.systems = null;
    }
    onAnyKeyDown(event) {
      if (!this.modKey.isDown) return;
      const method = this.keyMap[event.keyCode];
      if (!method) return;
      method.call(this);
    }
    addKeyboardControls(keyboard) {
      this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
        camera: this.camera,
        up: keyboard.addKey(KeyCodes.UP),
        down: keyboard.addKey(KeyCodes.DOWN),
        left: keyboard.addKey(KeyCodes.LEFT),
        right: keyboard.addKey(KeyCodes.RIGHT),
        speed: 1
      });
      this.modKey = keyboard.addKey(KeyCodes.SHIFT);
      keyboard.on(KeyboardEvents.ANY_KEY_DOWN, this.onAnyKeyDown, this);
    }
    hide() {
      this.text.visible = false;
    }
    show() {
      this.text.visible = true;
    }
    toggle() {
      this.text.visible = !this.text.visible;
    }
    resetCamera() {
      this.camera.setScroll(0, 0);
    }
    pageUp() {
      this.camera.scrollY -= this.camera.height;
    }
    pageDown() {
      this.camera.scrollY += this.camera.height;
    }
    pageStart() {
      this.camera.scrollY = 0;
    }
    pageEnd() {
      this.camera.scrollY = POSITIVE_INFINITY;
    }
  }
  const proto = DisplayListWatcher.prototype;
  proto.keyMap = {
    [KeyCodes.C]: proto.hide,
    [KeyCodes.END]: proto.pageEnd,
    [KeyCodes.HOME]: proto.pageStart,
    [KeyCodes.PAGE_DOWN]: proto.pageDown,
    [KeyCodes.PAGE_UP]: proto.pageUp,
    [KeyCodes.V]: proto.resetCamera,
    [KeyCodes.X]: proto.show,
    [KeyCodes.Z]: proto.toggle
  };
  return DisplayListWatcher;
});
