AFRAME.registerComponent("enemy-bullets", {
    init: function () {
        setInterval(this.shootEnemyBullet, 2000)
    },
    shootEnemyBullet: function () {

        //get all enemies using className
        var els = document.querySelectorAll(".enemy");

        for (var i = 0; i < els.length; i++) {

            //enemyBullet entity
            var enemyBullet = document.createElement("a-entity");
            enemyBullet.setAttribute("geometry", {
                primitive: "sphere",
                radius: 0.4,
            });

            enemyBullet.setAttribute("material", {
                color: "#282B29"
            });

            var position = els[i].object3D.getWorldPosition();

            enemyBullet.setAttribute("position", {
                x: position.x + 1.5,
                y: position.y + 3.5,
                z: position.z,
            });

            var scene = document.querySelector("#scene");
            scene.appendChild(enemyBullet);

            //Three.js Vector Variables

            var pos1 = new THREE.Vector3();
            var pos2 = new THREE.Vector3();

            var enemy = els[i].object3D;
            var player = document.querySelector("#weapon").object3D;

            //Get enemy and player position using Three.js methods
            enemy.getWorldPosition(pos1);
            player.getWorldPosition(pos2);

            var dir = new THREE.Vector3();

            dir.subVectors(pos1, pos2).normalize();

            //set the velocity and it's direction
            enemyBullet.setAttribute("velocity", dir);

            //Set dynamic-body attribute
            enemyBullet.setAttribute("dynamic-body", { mass: 0, shape: "circle" });

            //collide event on enemy bullets
            enemyBullet.addEventListener("collide", function (e) {
                if (e.detail.body.el.id === "weapon") {

                    var playerEl = document.querySelector("#countLife");
                    var life = parseInt(playerEl.getAttribute("text").value);

                    if (life > 0) {
                        life = life - 1;
                        playerEl.setAttribute("text", {
                            value: life
                        });
                    }

                    if (life < 0) {
                        var enemyEl = document.querySelectorAll(".enemy");
                        for (var i = 0; i < enemyEl.length; i++) {
                            scene.removeChild(enemyEl[i]);
                        }

                        var text = document.querySelector("#over");
                        text.setAttribute("visible", true);
                    }
                }
            });
        }
    },
});

