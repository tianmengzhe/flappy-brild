

const bird = {
    skyStep: 2,
    startFlag: false,
    skyPosition: 0,
    birdTop: 235,
    startColor: 'blue',
    startFlag:false,
    birdStepY:0,
    minTop: 0,
    maxTop: 570,
    skyTime:null,
    pipeLength: 7,
    pipeArr:[],
    pipeLastIndex: 6,
    pipeDistance:230,
    score:0,
    init(){
        this.initData()
        this.animate()
        this.handleStart()
        this.handleClick()
        
    },
    initData(){ // 初始化
        this.el = document.querySelector("#app")
        this.obird = this.el.querySelector('.bird')
        this.oSatrt = this.el.querySelector('.start')
        this.oScore = this.el.querySelector('.score') 
        this.oMask = this.el.querySelector('.mask') 
        this.oEnd = this.el.querySelector('.end') 
        this.oRank = this.el.querySelector('.rank')
        this.oFilalScore = this.el.querySelector('.final-score')
        
        
    },
    animate(){
        let count = 0
        this.skyTime = setInterval(()=>{
            this.skyMove()
            this.birdFly(count)
            if(this.startFlag){ // 小鸟下落
                this.bordDrop()
                this.pipeMove()
            }

            // 300 毫秒执行一次birdJump
            if(++count%10 === 0){
                count = 0
                if(!this.startFlag){ // 游戏开始 关闭开始游戏文字效果切换 小鸟初始动画 
                    this.startBound();
                    this.birdJump();
                }else{ 
                    this.bordDrop()
                }
            }
        },30)
    },
    skyMove(){
        this.skyPosition -= this.skyStep
        this.el.style.backgroundPositionX = this.skyPosition + 'px'
    },
    birdJump(){ // 小鸟初始动画 
        this.birdTop = this.birdTop === 220 ? 260 : 220 
        this.obird.style.top = this.birdTop +'px'
    },
    birdFly(count){ // 小鸟背景图片移动
        // 0 -30 60
        this.obird.style.backgroundPositionX = count % 3 * -30+ 'px'
    },
    bordDrop(){ // 小鸟下落
        this.birdTop += ++this.birdStepY  // 加速下落
        this.obird.style.top = this.birdTop +'px'
        this.judgeKnock()
        this.addScore()
    },
    addScore(){ // 加分
        let index = this.score % this.pipeLength  // 当前接近小鸟的柱子
        let pX = this.pipeArr[index].up.offsetLeft // 上柱子的left
        if(pX < 13){ 
            this.oScore.innerText = ++this.score
        }
    },
    judgeKnock(){ // 碰撞检测
        this.judgeBoundary() // 是否触底
        this.judegPipe() // 是否触发柱子
    },
    judgeBoundary(){
        // top = 0  minTop
        // bottom = 容器高 - 鸟高 maxTop
        if(this.birdTop <= this.minTop || this.birdTop >= this.maxTop){
            this.failGame()
        }
    },
    judegPipe(){ // 是否触发柱子
        /**
         * 安全范围
         * 上下安全距离 上柱子高度 ~~~ 上柱子高度-150
         * 触碰安全距离  
         *      95 小鸟与柱子左边在 y轴相遇  小鸟宽30 + 小鸟left80 + margin-left-15
         *      13 小鸟与柱子右边前 y轴相遇  柱子宽52 + 柱子left + 小鸟margin-left-15 < 80
         * */ 
        let index = this.score % this.pipeLength
        let pX = this.pipeArr[index].up.offsetLeft // 上柱子的left
        let pY = this.pipeArr[index].y
        let birdY = this.birdTop
        if((pX <= 95 && pX > 13) && (birdY <= pY[0] || birdY >= pY[1])){
            this.failGame()
        }   
    },
    failGame(){ // 游戏失败
        clearInterval(this.skyTime)
        this.skyTime = null
        this.oMask.style.display = "block"
        this.oEnd.style.display = "block"
        this.obird.style.display = "none"
        this.oScore.style.display = "none"
        this.oFilalScore.innerText = this.score
        this.renderList()// 分数列表
    },
    renderList(){
        const template = `<li class="rank-item">
            <span class="rank-degree">1</span>
            <span class="rank-score">5</span>
            <span class="rank-time">2020-08-16</span>
        </li>
        `
    },
    pipeMove(){
        for(var i = 0; i < this.pipeLength; i++){
            let {up, down} = this.pipeArr[i]
            let x = up.offsetLeft - this.skyStep
            if(x <= -52){
                x = this.pipeArr[this.pipeLastIndex].up.offsetLeft + this.pipeDistance
                this.pipeLastIndex = i
            }
            up.style.left = x +'px'
            down.style.left = x +'px'
        }
    },
    createPipe(left){ // 生成柱子
        // 50 - 225  // 上下距离 150 
        let upH = 50 + Math.floor(Math.random()*175) 
        var odiv = this.crearteEle('div',['pipe','pipe-up'],{
            height: upH + 'px',
            left: left + 'px'
        })
        
        var odiv2 = this.crearteEle('div',['pipe','pipe-down'],{
            height: (600 - upH - 150) + 'px',
            left: left + 'px'
        })
        this.el.appendChild(odiv)
        this.el.appendChild(odiv2)

        this.pipeArr.push({
            up:odiv,
            down:odiv2,
            y:[upH,upH+150]// 安全距离
        })
    },
    crearteEle(eleName,classArr,styleObj){
        var odiv2 = document.createElement(eleName)
        classArr.forEach(item => {
            odiv2.classList.add(item)
        });
        Object.keys(styleObj).forEach(key => {
            odiv2.style[key] = styleObj[key]
        })
        return odiv2
    },
    startBound(){ // 开始游戏文字效果切换
        this.oSatrt.classList.remove('start-'+this.startColor)
        this.startColor = this.startColor === 'blue' ? 'white':'blue'
        this.oSatrt.classList.add('start-'+this.startColor)
    },
    handleStart(){
        const _this = this
        this.oSatrt.onclick = function(e){
            e.stopPropagation()
            
            this.style.display = 'none'
            _this.oScore.style.display = 'block'
            _this.skyStep = 5
            _this.obird.style.left = "80px"
            _this.obird.style.transition = "none"
            _this.startFlag = true

            for(var i = 0; i < _this.pipeLength; i++){
                _this.createPipe(_this.pipeDistance*(i+1))// 生成柱子
            }
            
        }
    },
    handleClick(){ 
        let _this = this
        this.el.onclick = function(){
            _this.birdStepY = -10
        }
    }
}
bird.init()
