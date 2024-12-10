(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require("phaser")) : typeof define === "function" && define.amd ? define(["phaser"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.DisplayListWatcher = factory(global.Phaser));
})(this, function(Phaser) {
  "use strict";
  const proggyCleanInv = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQ4AAABKCAMAAAB90UpZAAABEVBMVEUAAADUUP1/f398e3x+fn58fHx8fH3///97e3t6e3t5eXl3d3d2dXV2dXZzc3NzdHNxcnFxcXFvb29sbGxtbW1qamprampoaGhmZWVlZmVjY2JjY2NgX2BgYGBeXV5dXl1aWlpYWFdYV1dVVFVUVFVSUVJSUlJPT05PTk9MTEtMTExISUlISUhGRkZGRkVDQ0NCQ0M/QD9AP0A9PD06OTo6Ojk2Njc2Nzc0NDQ0MzMwMDEwMDAuLi0tLS4rKysqKisnKCcnJyckJSQlJSUiIiIfHx8gHx8cHB0ZGRkaGhoXGBcXFxcUFRUVFRQTEhISEhMQEBAODg4ODQ4MCwsMDAwKCQoKCgoICAgGBgYGBQYFBATgX/oDAAADz0lEQVR4AeyVB1LEMAxFRRW9d+5/T8gfj/chNOuEXvRIpEiORfa72QdRFEVRbEx0Jx+zU8JkBbN8VVadf7McMpkzOlmGdCwzafJXZgfkaBOAjbkc6P8X5BhMEpg5s0Pmr8iR7R1BDjTCUcAp+R8piqIoNkGxkqPYepZjRfGJcpQcJUfJUXKUHCVHsb2NoNjZ7Y/uMnJ66JHLN9fbzGSQ60lnweaT/4BI3kXrjrd6TUTCOv2juxP46lns7Qc5eDcrZ92hzZzpfqdy4NLNKBSLcvhrOeh6HsXYeQEHB3LZ58XBTlwiB1KOPxlInESoyja3cGVqsADrLJXj8DDIMRGKYs3wY0Q6aZbLYe65HKhgno4OA84K/iKby9GxNaCDj2aHe7ZYsHgpcDNBW0Sc7zTs6mtWSpbM59GQk1PW84EcSI4XSy7HmtnsmRxh90FxgCTkEMvkODtP5fiQrVQWI+toG2+ljPJXCJPOR0ZjLi6CHBPpQYuiyUErG6pEOWRYhfKzAKNcDgx9j7qzVQujOVxe2Tfi9sO4vkFQ3N4iKO7uERQPj6PVzAx3JY8PL06ZJ/bMArl2GIaiHjyL+FBm7isz739HZYiuNB67gaIfhpToxJJ1Hb4mjr//KnCQ2VMZDZxbIcnIoj9F7f/YN8Ch9VfwU9jGx20g4MgSbaO5pIK4OeDbPQMrSU+kjpBE66hsVxptcExMWsbkABMW41qkywJZm7hSNSkONRTqeysBMVQoxzE1bUxan/RWlOAgleKwHFAcykLrUo1iX94DtThmZkMBhr/hZTioxWFcEhyqaNXzGEcbzTI3LziGDhb1SbwzihaDKsCBN1SHY2FRgiWTShM+rGJF63HECVlM+n0C/EatSUGEWTImy9rScmcDItWH8umU38pqNxcEpG+AY229bv+M6wPhoE8BsLHZWPhto5Gt+9FspDPcnfdv9H+ZEKCXkNna1nPTXJBF3h3JqAtYxhAJYnyUxDi6YrOz2xYHBcGsLujUui8cCHsOfePY2y/AYZYkrIhR4XEAQIjjyRweR1XIaaMe1cFhPQ7RsBj37I4A7oY2FuRJmz5b9Q/Ie8ZxdOzmryCLAyT5inqXmjEX7sQ4VL5KzdlnKXJy2q53GKEV9w5ZcNnDuJyIZdpAOM7OW+aOlIgvvaRzqF2Po66hP7WoLi5bjiwApReJrETNmHm0+t7RHsfVVf91B4ovS5AWIUDbALq+aVGV9t4YmEa6az++CQCGgQAGht2nd1f+QLwKhG67CETzgmjdEO0HovNCdN+InhfR9yNKGVEpiGpD1PskGtJlPAcJ+yNWAAAAAElFTkSuQmCC";
  const textureKey = "proggy_clean_inv";
  const GetObjectDescription = (obj, depth) => {
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
      const posStr = `(${obj.x.toFixed(1)}, ${obj.y.toFixed(1)})`;
      const visible = obj.visible ? "+" : "-";
      const indent = " ".repeat(2 * depth);
      output = `${indent}${visible} ${obj.type} ${obj.name} ${posStr} ${obj.depth} ${countStr}`;
    }
    return output;
  };
  const WalkDisplayListObj = (obj, output = [], depth = 0) => {
    output.push(GetObjectDescription(obj, depth));
    if (obj.list) {
      depth += 1;
      for (const child of obj.list) {
        WalkDisplayListObj(child, output, depth);
      }
    }
    return output;
  };
  class DisplayListWatcher extends Phaser.Plugins.ScenePlugin {
    boot() {
      this.systems.textures.addBase64(textureKey, proggyCleanInv);
      if (this.systems.settings.key === "__SYSTEM") {
        return;
      }
      const events = this.systems.events;
      events.on("start", this.start, this);
      events.on("shutdown", this.stop, this);
      events.on("update", this.update, this);
      events.on("render", this.render, this);
      events.on("destroy", this.destroy, this);
    }
    start() {
      const { keyboard } = this.systems.input;
      const { width, height } = this.systems.scale;
      this.camera = new Phaser.Cameras.Scene2D.Camera(
        0,
        0,
        width,
        height
      ).setBounds(0, 0, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
      this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
        camera: this.camera,
        up: keyboard.addKey("UP"),
        down: keyboard.addKey("DOWN"),
        left: keyboard.addKey("LEFT"),
        right: keyboard.addKey("RIGHT"),
        speed: 1
      });
      this.shiftKey = keyboard.addKey("SHIFT");
      this.zKey = keyboard.addKey("Z");
      this.xKey = keyboard.addKey("X");
      this.cKey = keyboard.addKey("C");
      this.vKey = keyboard.addKey("V");
      this.zKey.on("down", (key, event) => {
        if (event.shiftKey) {
          this.toggle();
        }
      });
      this.xKey.on("down", (key, event) => {
        if (event.shiftKey) {
          this.show();
        }
      });
      this.cKey.on("down", (key, event) => {
        if (event.shiftKey) {
          this.hide();
        }
      });
      this.vKey.on("down", (key, event) => {
        if (event.shiftKey) {
          this.resetCamera();
        }
      });
      this.text = this.systems.make.bitmapText({ font: "__FONT" }, false);
      this.renderText = this.systems.renderer.type === Phaser.WEBGL ? this.text.renderWebGL : this.text.renderCanvas;
    }
    stop() {
      if (this.text) {
        this.text.destroy();
        this.text = null;
      }
    }
    update(time, delta) {
      if (this.shiftKey.isDown) {
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
    sceneDestroy() {
      this.stop();
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
