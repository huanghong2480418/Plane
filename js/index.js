
class Plane {
  constructor() {
    this.gameStatic = false
    this.gameW = 320
    this.gameH = 568
    this.myPlaneW = 80
    this.myPlaneH = 112
    this.over = null
    this.wudi = true
  }

  $(Name) {
    if (Name.substr(0, 1) == "#") {
      Name = Name.substr(1);
      return document.getElementById(Name);
    } else if (Name.substr(0, 1) == ".") {
      Name = Name.substr(1);
      return document.getElementsByClassName(Name)[0];
    } else {
      return document.getElementsByTagName(Name);
    }
  }
  getStyle(ele, attr) {
    var res = null;
    if (ele.currentStyle) {
      res = ele.currentStyle[attr];
    } else {
      res = window.getComputedStyle(ele, null)[attr];
    }
    return parseFloat(res);
  }
  _indexOf(arr, val) {
    for(var i = 0; i < arr.length; i++) {
      if (arr[i] == val) 
        return i
      return -1
    }
  }
  Arrayremove(arr, val) {
    let index = this._indexOf(arr, val)
    if (index > -1) 
      arr.splice(index, 1)
  }
}

class GameStart extends Plane {
  constructor() {
    super()
    this.startBtn = this.$(".gameStart")
    this.Main = this.$(".gameMain")
    this.gameover = this.$(".gameover")
    this.overscore = this.$(".overscore")
    this.chong = this.$(".restart")
    this.wuditime = 5000
    this.wuditimer = null
    window.gameOverTimer = null
    this.bgMove = new BgMove()
    this.MyPlane = new MyPlane()
    this.Bullets = new Bullets()
    this.Enemys = new Enemys()
    this.Rule = new Rule()
    this.over = this.pause()
    this.gameOver()
    this.startBtn.addEventListener("click", () => {
      this.start()
    })
    this.chong.addEventListener("click", () => {
      window.location.reload()
    })
    document.addEventListener("keydown", e => {
      let evt = e || window.event
      if (evt.keyCode == 32) {
        this.gameStatic = !this.gameStatic
        if (this.gameStatic) {
          this.start()
        } else {
          this.pause()
        }
      }
      if (evt.keyCode == 82) {
        this.reStart()
      }
    })
  }
  start() {
    this.gameStatic = true
    this.Bullets.shot()
    this.MyPlane.MyPlaneMove()
    this.startBtn.style.display = "none"
    this.Main.style.display = "block"
    this.bgMove.move()
    if (this.Bullets.bulletArr.length != 0) this.Bullets.reBulletMove(this.Bullets.bulletArr)
    if (this.Enemys.enemyArr.length != 0) this.Enemys.reEnemyMove(this.Enemys.enemyArr)
    this.Enemys.addEnemy()
  }
  pause() {
    this.gameStatic = false
    document.onmousemove = null
    clearInterval(this.bgMove.bgTimer)
    clearInterval(this.Bullets.bulletTimer)
    clearInterval(this.Enemys.enemyTimer)
    this.bgMove.bgTimer = null
    this.Bullets.bulletTimer = null
    this.Enemys.enemyTimer = null
    this.Bullets.clear(this.Bullets.bulletArr)
    this.Enemys.clear(this.Enemys.enemyArr)
  }
  reStart() {
    location.reload(true)
  }
  gameOver() {
    window.gameOverTimer = setInterval(() => {
      for (let i = 0; i < this.Enemys.enemys.children.length; i++) {
        let enemyL = this.getStyle(this.Enemys.enemys.children[i], "left")
        let enemyT = this.getStyle(this.Enemys.enemys.children[i], "top")
        let planeL = this.getStyle(this.MyPlane.plane, "left")
        let planeT = this.getStyle(this.MyPlane.plane, "top")
        let condition = enemyL + this.Enemys.enemys.children[i].width >= planeL && enemyL <= planeL + this.MyPlane.planeW && enemyT + this.Enemys.enemys.children[i].height >= planeT && enemyT <= planeT + this.MyPlane.planeH && this.Enemys.enemys.children[i].dead == false
        if (this.MyPlane.plane.getAttribute("data-wudi")) {
          this.wudi = false
          this.MyPlane.plane.classList.add("bao")
          this.wuditimer = setTimeout(() => {
            console.log("无敌时间到")
            this.wudi = true
            this.MyPlane.plane.classList.remove("bao")
            this.MyPlane.plane.removeAttribute("data-wudi")
            clearTimeout(this.wuditimer)
            this.wuditimer = null
          }, 5000)
        }
        if (this.wudi) {
          if (condition) {
            clearInterval(window.gameOverTimer)
            this.Enemys.enemys.children[i].src = "./images/enemy" + this.Enemys.enemys.children[i].type + "peng.gif"
            this.MyPlane.plane.src = "./images/本方飞机爆炸.gif"
            // this.MyPlane.plane.parentNode.removeChild(this.MyPlane.plane)
            clearInterval(this.Enemys.enemys.children[i].timer)
            this.pause()
            this.overscore.innerHTML = this.$(".score").innerHTML
            this.gameover.style.display = "block" 
          }
        }
      }
    }, 10)
  }
}

class BgMove extends Plane {
  constructor() {
    super()
    this.Main = this.$(".gameMain")
    this.backgroundPY = 0
    this.bgTimer = null
  }
  move() {
    this.bgTimer = setInterval(() => {
      this.backgroundPY++
      if (this.backgroundPY > this.gameH) {
        this.backgroundPY = 0
      } else {
        this.Main.style.backgroundPositionY = this.backgroundPY + "px"
      }
    }, 10)
  }
}

class MyPlane extends Plane {
  constructor() {
    super()
    this.game = this.$(".game")
    this.plane = this.$(".myPlan")
    this.gameML = this.getStyle(this.game, "marginLeft")
    this.gameMT = this.getStyle(this.game, "marginTop")
    this.planeW = this.getStyle(this.plane, "width")
    this.planeH = this.getStyle(this.plane, "height")
    this.Rule = new Rule()
  }
  MyPlaneMove() {
    document.onmousemove = event => {
      let e = event || window.event
      let mouseX = e.x || e.clientX
      let mouseY = e.y || e.clientY

      let PlaneL = mouseX - this.gameML - this.planeW / 2
      let PlaneT = mouseY - this.gameMT - this.planeH / 2
      if (PlaneL < 0) {
        PlaneL = 0
      } else if (PlaneL >= this.gameW - this.planeW) {
        PlaneL = this.gameW - this.planeW
      }

      if (PlaneT < 0) {
        PlaneT = 0
      } else if (PlaneT >= this.gameH - this.planeH) {
        PlaneT = this.gameH - this.planeH
      }
      this.plane.style.left = PlaneL + "px"
      this.plane.style.top = PlaneT + "px"
    }
  }
}

class Bullets extends Plane {
  constructor() {
    super()
    this.bulletW = 32
    this.bulletH = 32
    this.bulletSrc = "./images/bullet1.png"
    this.bulletTimer = null
    this.plane = this.$(".myPlan")
    this.bullets = this.$(".bullets")
    this.speed = -10
    this.bulletArr = []
    this.MyPlane = new MyPlane()
    this.time = 5000
    this.buff = true
    this.buffTimer = null
  }
  shot() {
    if (this.bulletTimer)
      return
    this.bulletTimer = setInterval(() => {
      this.createBullet()
      if (this.MyPlane.plane.getAttribute("data-san") != null) {
        this.createBuffBullet()
        this.buffTimer = setTimeout(() => {
          console.log("时间到")
          this.MyPlane.plane.removeAttribute("data-san")
          clearTimeout(this.buffTimer)
        }, this.time)        
        this.buffTimer = null
      }
    }, 100)
  }
  createBullet(pl = 0, pr = 0) {
    let bullet = new Image()
    bullet.src = this.bulletSrc
    bullet.className = "bullet"

    let PlaneL = this.getStyle(this.plane, "left")
    let PlaneT = this.getStyle(this.plane, "top")

    let bulletL = PlaneL + this.myPlaneW / 2 - this.bulletW / 2 + pl + -pr
    let bulletT = PlaneT - this.bulletH

    // bullet.style.position = "absolute"
    bullet.style.left = bulletL + "px"
    bullet.style.top = bulletT + "px"

    this.bullets.append(bullet)
    this.bulletArr = this.bullets.children
    this.BulletMove(bullet)
  }
  createBuffBullet() {
    this.createBullet(this.bulletW, 0)
    this.createBullet(0, this.bulletW)
  }
  BulletMove(ele) {
    ele.timer = setInterval(() => {
      let moveVal = this.getStyle(ele, "top")
      if (moveVal <= this.bulletH) {
        clearInterval(ele.timer)
        ele.parentNode.removeChild(ele)
        this.bulletArr = this.bullets.children
      } else {
        ele.style.top = moveVal + this.speed + "px"
      }
    }, 10)
  }
  reBulletMove(childs) {
    for (let i = 0; i < childs.length; i++) {
      this.BulletMove(childs[i])
    }
  }
  clear(childs) {
    for (let i = 0; i < childs.length; i++) {
      clearInterval(childs[i].timer)
    }
  }
}

class Enemys extends Plane {
  constructor() {
    super()
    this.enemyObj = {
      enemy1: {
        width: 34,
        height: 24,
        score: 100,
        hp: 100
      },
      enemy2: {
        width: 46,
        height: 60,
        score: 500,
        hp: 800
      },
      enemy3: {
        width: 110,
        height: 164,
        score: 1000,
        hp: 2000
      }
    }
    this.enemys = this.$(".enemys")
    this.enemyArr = []
    this.speed = 0
    this.enemyTimer = null
    this.Rule = new Rule()
  }
  addEnemy() {
    if (this.enemyTimer) return 
    this.enemyTimer = setInterval(() => {
      this.createEnemy()
      this.Rule.deadEnemy(this.enemys.children, this.enemys)
    }, 1000)
  }
  createEnemy() {
    let probability = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3]
    let enemyType = probability[Math.floor(Math.random() * probability.length)]
    let enemyData = this.enemyObj["enemy" + enemyType]
    let enemy = new Image(enemyData.width, enemyData.height)
    enemy.src = "./images/enemy" + enemyType + ".png"
    enemy.className = "enemy"
    enemy.type = enemyType
    enemy.score = enemyData.score
    enemy.hp = enemyData.hp
    enemy.dead = false
    let enemyL = Math.random() * (this.gameW - enemyData.width)
    let enemyT = -enemyData.height

    enemy.style.left = enemyL + "px"
    enemy.style.top = enemyT + "px"
    this.enemys.append(enemy)
    this.enemyArr = this.enemys.children
    this.EnemyMove(enemy)
  }
  EnemyMove(ele) {
    if (ele.type == 1) {
      this.speed = 1.5
    } else if (ele.type == 2) {
      this.speed = 1
    } else if (ele.type == 3) {
      this.speed = 0.2
    }
    ele.timer = setInterval(() => {
      let moveVal = this.getStyle(ele, "top")
      if (moveVal >= this.gameH) {
        clearInterval(ele.timer)
        ele.parentNode.removeChild(ele)
        this.enemyArr = this.enemys.children
      } else {
        ele.style.top = moveVal + this.speed + "px"
        this.Rule.danger(ele)
      }
    }, 30)
  }
  reEnemyMove(childs) {
    for (let i = 0; i < childs.length; i++) {
      this.EnemyMove(childs[i])
    }
  }
  clear(childs) {
    for (let i = 0; i < childs.length; i++) {
      clearInterval(childs[i].timer)
    }
  }
}

class Rule extends Plane {
  constructor() {
    super()
    this.score = 0
    this.ban = this.$(".score")
    this.game = this.$(".game")
    this.propies = []
    this.propsW = 32
    this.propsH = 32
  }
  danger(enemy) {
    this.Bullets = new Bullets()
    for (let i = 0; i < this.Bullets.bullets.children.length; i++) {
      
      let bulletL = this.getStyle(this.Bullets.bullets.children[i], "left")
      let bulletT = this.getStyle(this.Bullets.bullets.children[i], "top")
      let enemyL = this.getStyle(enemy, "left")
      let enemyT = this.getStyle(enemy, "top")
      let enemyW = this.getStyle(enemy, "width")
      let enemyH = this.getStyle(enemy, "height")

      
      let condition = bulletL + this.Bullets.bulletW >= enemyL && bulletL <= enemyL + enemyW && bulletT <= enemyT + enemyH && bulletT + this.Bullets.bulletH >= enemyT

      if (condition) {
        clearInterval(this.Bullets.bullets.children[i].timer)
        this.Bullets.bullets.removeChild(this.Bullets.bullets.children[i])
        enemy.hp -= 50
        if (enemy.type == 2) {
          enemy.src = "./images/enemy" + enemy.type + "ai.png"
        } else if (enemy.type == 3) {
          enemy.src = "./images/enemy" + enemy.type + "ai.png"
        }
        if(enemy.hp <= 0) {
          clearInterval(enemy.timer)
          enemy.src = "./images/enemy" + enemy.type + "bo.gif"
          enemy.dead = true
          this.score += enemy.score
          this.ban.innerHTML = this.score
          let sui = Math.floor(Math.random() * 20)
          if (enemy.type != 1 && sui < 3) {
            console.log(this.propies)
            if (this.propies.length <= 5) {
              let propsType = Math.floor(Math.random() * enemy.type)
              let propsData = new Image(this.propsW, this.propsH)
              propsData.type = propsType
              propsData.className = "props"
              propsData.src = "./images/jineng" + (propsType + 1) + ".png"
              let enemyL = this.getStyle(enemy, "left")
              let enemyT = this.getStyle(enemy, "top")
              let propsL = enemyL + this.getStyle(enemy, "width") / 2
              let propsT = enemyT + this.getStyle(enemy, "height") / 2
              propsData.style.left = propsL + "px"
              propsData.style.top = propsT + "px"
              this.game.appendChild(propsData)
              this.propies.push(propsData)
              this.propsMove(propsData)
            }
          }
        }
      }
    }
  }
  deadEnemy(enemyChild, enemys) {
    for (let i = enemyChild.length - 1; i >= 0; i--) {
      if (enemyChild[i].dead) {
        (index => {
          enemys.removeChild(enemyChild[index])
        })(i);
      }
    }
  }
  propsMove(props) {
    let x = 1
    let y = 1
    setInterval(() => {
      let propsT = this.getStyle(props, "top")
      let propsL = this.getStyle(props, "left")
      if (propsT >= this.gameH - 36 || propsT <= 4) {
        y = -y
      }
      if (propsL >= this.gameW - 36 || propsL <= 4) {
        x = -x
      }
      propsT += y
      propsL += x

      props.style.top = propsT + "px"
      props.style.left = propsL + "px"
      this.addProps(props)
    }, 50)
  }
  addProps(props) {
    this.MyPlane = new MyPlane()
    this.Enemys = new Enemys()
    let propsL = this.getStyle(props, "left")
    let propsT = this.getStyle(props, "top")
    let planeL = this.getStyle(this.MyPlane.plane, "left")
    let planeT = this.getStyle(this.MyPlane.plane, "top")
    
    let condition = propsL + this.propsW >= planeL && propsL <= planeL + this.MyPlane.planeW && propsT + this.propsH >= planeT && propsT <= planeT + this.MyPlane.planeH
    if (condition) {
      this.game.removeChild(props)
      this.Arrayremove(this.propies, props)
      console.log(this.propies)
      switch(props.type) {
        case 0:
          this.MyPlane.plane.setAttribute("data-wudi", true)
          break
        case 1:
          this.MyPlane.plane.setAttribute("data-san", true)
          break
      }
    }
  }
}

window.onload = function () {
  new GameStart()
}