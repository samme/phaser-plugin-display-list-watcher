(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require("phaser")) : typeof define === "function" && define.amd ? define(["phaser"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.DisplayListWatcher = factory(global.Phaser));
})(this, function(Phaser) {
  "use strict";
  const chars = `ABCDEFGHIJKLMNOPQRSTUVWXYZ 12345abcdefghijklmnopqrstuvwxyz 67890{}[]()<>$*-+=/#_%^@\\&|~?'" !,.;:`;
  const charsPerRow = 32;
  const height = 13;
  const image = "proggy_clean_inv";
  const offset = { "x": 5, "y": 24 };
  const spacing = { "x": 0, "y": 0 };
  const width = 7;
  const fontData = {
    chars,
    charsPerRow,
    height,
    image,
    offset,
    spacing,
    width
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
  const SceneEvents = Phaser.Scenes.Events;
  const ParseRetroFont = Phaser.GameObjects.RetroFont.Parse;
  const fontTextureKey = fontData.image;
  const fontKey = fontData.image;
  let hasPendingFontImage = false;
  class DisplayListWatcher extends Phaser.Plugins.ScenePlugin {
    constructor(scene, pluginManager) {
      super(scene, pluginManager);
      this.camera = null;
      this.controls = null;
      this.hideKey = null;
      this.modKey = null;
      this.resetKey = null;
      this.showKey = null;
      this.text = null;
      this.toggleKey = null;
    }
    boot() {
      const { textures } = this.systems;
      if (!hasPendingFontImage && !textures.exists(fontTextureKey)) {
        hasPendingFontImage = true;
        textures.addBase64(fontKey, fontImage);
      }
      textures.once(`${TextureEvents.ADD_KEY}${fontTextureKey}`, () => {
        this.systems.cache.bitmapFont.add(
          fontKey,
          ParseRetroFont(this.scene, fontData)
        );
      });
      if (this.systems.settings.key === "__SYSTEM") {
        return;
      }
      const events = this.systems.events;
      events.on(SceneEvents.START, this.start, this);
      events.on(SceneEvents.SHUTDOWN, this.stop, this);
      events.on(SceneEvents.DESTROY, this.destroy, this);
    }
    startIfFontWasAdded(cache, key) {
      if (key !== fontKey) {
        return;
      }
      cache.events.off(CacheEvents.ADD, this.startIfFontWasAdded, this);
      this.start();
    }
    start() {
      const { cache, events, make, renderer } = this.systems;
      const fontCache = cache.bitmapFont;
      const { keyboard } = this.systems.input;
      const { width: width2, height: height2 } = this.systems.scale;
      if (!fontCache.exists(fontKey)) {
        fontCache.events.on(CacheEvents.ADD, this.startIfFontWasAdded, this);
        return;
      }
      events.on(SceneEvents.UPDATE, this.update, this);
      events.on(SceneEvents.RENDER, this.render, this);
      this.camera = new Phaser.Cameras.Scene2D.Camera(
        0,
        0,
        width2,
        height2
      ).setBounds(0, 0, POSITIVE_INFINITY, POSITIVE_INFINITY);
      this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
        camera: this.camera,
        up: keyboard.addKey("UP"),
        down: keyboard.addKey("DOWN"),
        left: keyboard.addKey("LEFT"),
        right: keyboard.addKey("RIGHT"),
        speed: 1
      });
      this.modKey = keyboard.addKey("SHIFT");
      this.toggleKey = keyboard.addKey("Z");
      this.showKey = keyboard.addKey("X");
      this.hideKey = keyboard.addKey("C");
      this.resetKey = keyboard.addKey("V");
      this.toggleKey.on("down", (key, event) => {
        if (event.shiftKey) {
          this.toggle();
        }
      });
      this.showKey.on("down", (key, event) => {
        if (event.shiftKey) {
          this.show();
        }
      });
      this.hideKey.on("down", (key, event) => {
        if (event.shiftKey) {
          this.hide();
        }
      });
      this.resetKey.on("down", (key, event) => {
        if (event.shiftKey) {
          this.resetCamera();
        }
      });
      this.text = make.bitmapText({ font: fontKey }, false);
      this.renderText = renderer.type === Phaser.WEBGL ? this.text.renderWebGL : this.text.renderCanvas;
    }
    stop() {
      const { cache, events, input, settings } = this.systems;
      const { keyboard } = input;
      cache.bitmapFont.events.off(CacheEvents.ADD, this.startIfFontWasAdded, this);
      events.off(SceneEvents.UPDATE, this.update, this);
      events.off(SceneEvents.RENDER, this.render, this);
      keyboard.removeKey(this.hideKey, true);
      keyboard.removeKey(this.modKey, true);
      keyboard.removeKey(this.resetKey, true);
      keyboard.removeKey(this.showKey, true);
      keyboard.removeKey(this.toggleKey, true);
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
      this.hideKey = null;
      this.modKey = null;
      this.resetKey = null;
      this.showKey = null;
      this.toggleKey = null;
    }
    update(time, delta) {
      if (this.modKey.isDown) {
        this.controls.update(delta);
      }
    }
    render() {
      if (!this.text.visible) {
        return;
      }
      const maxLines = 100;
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
      const fullLength = output.length;
      if (fullLength > maxLines) {
        output.length = maxLines;
        output.push(`[ ... ${fullLength - maxLines} more ]`);
      }
      this.text.setPosition(x, y).setText(output);
      this.camera.preRender();
      this.renderText(renderer, this.text, this.camera);
    }
    destroy() {
      this.stop();
      this.pluginManager = null;
      this.game = null;
      this.scene = null;
      this.systems = null;
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
  }
  return DisplayListWatcher;
});
