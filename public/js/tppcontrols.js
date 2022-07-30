AFRAME.registerComponent("follow-box", {
  schema: {
    target: { type: "selector" },
  },
  tick: (function () {
    // create once
    const tmpv = new THREE.Vector3();

    return function (t, dt) {
      if (!this.data.target) return; // ignore when there is no target
      const target = this.data.target.object3D; // get the mesh
      // track the position
      const position = target.getWorldPosition(tmpv); // get the world position
      this.el.object3D.position.lerp(tmpv, 0.5); // linear interpolation towards the world position
    };
  })(),
});
AFRAME.registerComponent("rotate-with-camera", {
  tick: (function () {
    // create once
    const tmpq = new THREE.Quaternion();
    const tmpe = new THREE.Euler();

    return function (t, dt) {
      if (!this.el.sceneEl.camera) return; // ignore when there is no camera
      const cam = this.el.sceneEl.camera.el; // get the camera entity
      cam.object3D.getWorldQuaternion(tmpq); // get the world rotation
      tmpe.setFromQuaternion(tmpq, "YXZ");
      // set attribute is necesarry for wasd-controls
      this.el.setAttribute("rotation", {
        x: 0,
        y: (tmpe.y * 180) / Math.PI,
        z: 0,
      });
    };
  })(),
});
AFRAME.registerGeometry("example", {
  schema: {
    vertices: {
      default: ["-10 10 0", "-10 -10 0", "10 -10 0", "10 -10 0"],
    },
  },

  init: function (data) {
    var geometry = new THREE.Geometry();
    geometry.vertices = data.vertices.map(function (vertex) {
      var points = vertex.split(" ").map(function (x) {
        return parseInt(x);
      });
      return new THREE.Vector3(points[0], points[1], points[2]);
    });
    geometry.computeBoundingBox();
    geometry.faces.push(new THREE.Face3(0, 1, 2));
    geometry.faces.push(new THREE.Face3(0, 2, 3));
    geometry.mergeVertices();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    this.geometry = geometry;
  },
});
