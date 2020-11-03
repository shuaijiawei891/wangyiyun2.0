<template>
<div>
    <div class="songinfo">

        <audio :src="musicUrl" autoplay ref="myaudio"></audio>
        <div class="songdetail">
            <div class="logo">
                <img src="../../static/img/footer.png" />
            </div>
            <img src="../../static/img/needle-ip6.png" class="stop" />
            <div class="desc" @click="boFang()">
                <div class="pic">
                    <img src="../../static/img/disc-ip6.png" class="bigcircle" />
                    <img :src="picUrl" class="smallcircle" />
                </div>
                <span class="icon" v-show="flag"></span>
            </div>
            <div class="gci">
                <h2>
                    <span class="songname">{{name}}</span>
                    <span>-</span>
                    <span v-for="s in arr.ar " :key="s.id">{{s.name}}</span>
                </h2>
                <div class="gcdetail">
                    <div class="inersong">
                        <p class="song1" :class="{active:rightTime==key}" v-for="(val,key,index) in lyric" :key="index">{{val}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            arr: [],
            picUrl: "",
            name: "",
            musicUrl: "",
            flag: false,
            lyric: {},
            rightTime: "",
            rotate: 0
        };
    },
    mounted() {

        this.getDetail();
        this.getMusic();
        this.getLyric();
    },
    methods: {
        getDetail() {
            // 传递过来的参数需要使用this.$route.query.ids

            this.$http({
                url: this.$api.songdetail,
                params: {
                    ids: this.$route.query.ids
                }
            }).then(res => {

                (this.arr = res.data.songs[0]),
                (this.picUrl = res.data.songs[0].al.picUrl),
                (this.name = res.data.songs[0].name);
            });
        },
        getMusic() {
            this.$http({
                url: this.$api.songurl,
                params: {
                    id: this.$route.query.ids
                }
            }).then(res => {
                // console.log(res);
                this.musicUrl = res.data.data[0].url;
            });
        },
        // 歌曲播放
        // 默认的时候 false-->true-->暂停播放，icon显示
        // 点击到desc true-->false-->播放 ， icon隐藏
        // 假设点击icon的时候播放(false-->true)--》icon消失，再次点击的时候暂停---》icon显示
        boFang() {
            this.flag = !this.flag;
            if (this.flag) {
                this.$refs.myaudio.pause();
            } else {
                this.$refs.myaudio.play();
            }
        },
        // 转换歌词时间
        transTime(time) {
            // 7.890--向下取整--7  Math.ceil--向上取整--8  round---8
            let minutes = Math.floor(time / 60);
            //  补零操作 00
            minutes < 10 ? (minutes = "0" + minutes) : minutes;
            let second = Math.floor(time % 60);
            second < 10 ? (second = "0" + second) : second;
            return `${minutes}:${second}`;
        },
        // 获取歌词
        getLyric() {
            this.$http({
                url: this.$api.lyric,
                params: {
                    id: this.$route.query.ids
                }
            }).then(res => {
                // console.log(res);
                let ly = res.data.lrc.lyric;
                // 暂时存储歌曲的语句  键：值 {"00：00" :"lalala"}
                let obj = {};
                // 1.正则表达筛选字符串中带有的数组标识[] 需要注意小括号
                let reg = /\[(.*?)](.*)/g;
                //  2.对字符串进行拆分  replace

                // 三个参数  all：指的所有项 first：指的第一项   second：指的是第二项
                ly.replace(reg, (all, first, second) => {

                    //  slice 截取第一部分 保留 下标0-4
                    first = first.slice(0, 5);
                    // 把歌词存储到object里面
                    obj[first] = second;

                });
                // 把obj的内容赋值给事先定义好的lyric
                this.lyric = obj;
                //  3.实时监听音频的播放进度 转换成我们想要的时间格式

                let myaudio = this.$refs.myaudio;
                myaudio.ontimeupdate = () => {
                    //  myaudio.currentTime 是以秒进行的计算---00：07

                    let time = this.transTime(myaudio.currentTime);

                    //  4.筛选时间  存在一些时间上没有歌词
                    if (time in this.lyric) {
                        this.rightTime = time;
                    }
                    //5. 找到.active所在的位置
                    let active = document.getElementsByClassName("active")[0];
                    // 找到.active所在的下标
                    let index = this.$(".inersong").children().index(active);
                    if (active) {
                        if (active.offsetTop >= 35) {
                            this.$(".inersong").css("top", (-active.offsetTop + 35) + "px")
                        }
                    }
                    // 6.旋转
                    this.$(".pic").css("transform", `rotate(${this.rotate++}deg)`)
                };

            });
        }

    }
};
</script>

<style scoped>
.songinfo {
    width: 100%;
    height: 100vh;

    background: rgba(0, 0, 0, 0.5);
}

.logo img {
    width: 92px;
    height: 17px;
}

.songdetail {
    position: relative;
}

.stop {
    width: 96px;
    height: 137px;
    position: absolute;
    top: 0px;
    left: 50%;
    margin-left: -10px;
    z-index: 2;
}

.desc {
    padding-top: 45px;
    width: 296px;
    height: 296px;
    margin: 0 auto;
    position: relative;
}

.bigcircle {
    width: 296px;
    height: 296px;
}

.smallcircle {
    width: 184px;
    height: 184px;
    position: absolute;
    top: 56px;
    left: 56px;
    border-radius: 50%;
}

.icon {
    display: inline-block;
    width: 56px;
    height: 56px;
    transform: translate(-50%, -50%);
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKgAAACoCAMAAABDlVWGAAABJlBMVEUAAAAAAAD////l5eX///9iYmKDg4Pn5+f///9YWFj////09PT////4+Pjt7e3///////9oaGhBQUH////////////////CwsIaGhr///8xMTEkJCT////7+/vp6en///////////////+srKyoqKienp58fHz////y8vKTk5P///8EBAT////////////////V1dW3t7f////////////////////v7++jo6N9fX3///////+UlJT////s7Oz////Nzc3///////+RkZGPj495eXkTExP////////29vb////k5OTPz882Njb////////////c3Nz///////9ycnJsbGz///9dXV3////////Q0ND///9QUFD///////////////////9FeiN6AAAAYXRSTlNmAP3c+oWT3ueB9vA19ealRId5EQbuurpu83RxD/nh05dfAquooo+M7JtzaSolE+vMspJ3Wj7w6KSQj6ucKeXNxLWnmpmObVYd8t3axXZRSt7TvbKLideCeSzHnn4V3Nh6YarbPAAABlRJREFUeNrU14lWEmEYh/GXcdj3HQTZRCkS913UNE2zbLd9Oc/930Q2LmVpwPAC03MD/M5835n/IC6dkqHnzcVoZvdkLp2HfHruZDcTXWw+DyVdOilAt6uNjI8782Ua1W2XjTShtdDSmzRdlH6zFKq5bKQBTS5H57gqXJrP1tsb7kShkBPJFQoJ90a7np0vhblqLrrc8R7oQ4vVPZOLIp8mp8flzsanJ59FuMjcqxZdHVKFxvYDWK1lPQXpooInu4ZVYD/m6pAWNLn0DSvvekJ6KLHuxerb0qyrQwrQViV/oZzKSc/lpi6sgUrLdSN16MyWARBcOBWbnS4EAYytj67r1KGtqMUseaSvPCWLGr14u+pDZysmwFhc+i4+BmBWZgcATTXTFvO9qOS3qOlmShu68g7A6xa13F6A7yuq0ORnA9jZENU2dgDjc1IPGvMB4QNR7+AJ4IspQVObBjDmF+Wur6qxmdKAbpeBoEcGlCcIlLf7hx7lOzxOlYeaP+oTmmoYQFsGWhswGql+oMUMEInLgItHgEzRPvS43OHYVY+/fGwXGvIBkzKU6oAvZA8aywOPZEg9AvIxO9AXAZg4lKF1OAGBF71DX5jw5EyG2NkTMJ/3Co2ZcM8tQ819D8xYb9CVgA2nijSw0gs0tArBzk59aRBWQ91Dj30QjssIiofBd9wttFiGiTMZSWcTUC52B629Bg5lRB0Cr2tdQRvAfRlZ94FGN9AjA+oywupgHHWGzuRhTEbaGORnOkFTZYj4ZaT5I1BOdYBuAnEZcXFg89/QmAFtGXltMGL/ghZ9I7+g19fUV/wHtAJBvzggfxAqd0NXDPCII/KAsXIXNPXOIQd/efjvUndAmxB2xMH/zB+G5u3Qr2k4EMd0AOmvt0IrsCMOagcqt0FbJkyLg5oGs3ULNApecVReiP4NnTHALY7KDcbHv6BbDno1XTUGW39CWwa8F4flB6P1B3TRgQ/UeqSLN6GzAQd83f1dHAKzN6AfoCQOrARLN6Andr9GpiITT9/KwPLAye/QGATFTusAxsOCDKogxH6D7sOC2GkNq+B9GVALsP8LWgzAqdjJ4LJXCRlIpxAoXkOrtteT6yYmH8gg8kL1GroHU/1CoTSQBZ6CvSto0oRc/1DM7GNRLwdm8hK6DF5RgMI9j6jnheVLaBTWdaAwPy7KrUP0Alqbg4QWlPCU6JaAuZoFDcGaqEHh6RdRLQIhC/oBsppQzAXVN1UWlixoBjyqUIhozr8H3vyE1lYhpwnVnv8CpH9CZyAi2lAIPtK8pDPn0Cp8UoWqz/8zqJ5DGzCpCdWf/0lonEMzMK0J1Z//acicQ30wrgnVn/9x8LkkCWFRherPfxiSEgKvLlR//r0QkmWY14Xqz/88LEsTsqpQ/fm3RlQWoa4L1Z//OixKFNq6UP35vw9RycDGMKAYD3P9vEhlF9y6UP35d8OuvISELlR//hPwUqxh0oTqz781TbIKueFB4em4rb/Mq5IfMpRn0nOPIS+ADBUatvcz/w/0B/X2VgMACMNQ9AMnWOADKwT/QuahyZYcDcte7e146X9W+vFmWmEzOeOJGfjMCmWOEubMYw7no7wizHPHvMuMAMFIOo5IxsiOjJDLSOOM2cDYN44hxliMjGnL2OAOWMCgGgz84uBEDKDFIG8ORLhzLPO2Y5kK6PpMdJiBsR28nQkMOBEMJtTixISY4JUTZWPCgVXevesgCINhGG7dZPLEIg7GRRsMTsaoMTEOnmLUuBgn+e//JuTHGt0aKT3y3QIFpj6vO9ctnbnAmr9PIysefn0E0PfhkjW92HFtnQHULn5AAG9aISZGF3NaQYxVrInRrcVYBW4H5vkPEPIfuIV5UGXhClHT8Qv9oXQ/MckoTfb+wVTGqK8ZUl9+4mmUnpGj03pOmzlH5y/w5w6ZiAil+G9qA0KpkfWMTxKsJ6530wel3try9CwjSscg27BTDcw321gHjzyuEjj9IbwP1hPeDqHo2abP0pn5XMR/NhTB/fyo2gv3q0gh1JSkEHCrUuMSG1VxCdxDOtfR1ZDr4AGUwIUACi5JJZMyx1RHUgY3kIn0LBuFQk2EFlv7J3t0+id7JPi86wlJsfm9FUVbQrZR1LrPmQ0hKZfSXC7Fzr5LeD7uGoYBQBCGV56PS2g5ewGy+NkUNbjr9gAAAABJRU5ErkJggg==) 0 0 no-repeat;
    background-size: contain;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: 28px;
}

@keyframes change {
    0% {

        transform: rotate(0deg);
    }

    100% {

        transform: rotate(360deg);
    }
}

.gci {
    padding: 0px 35px;
    margin-top: 20px;
    color: hsla(0, 0%, 100%, 0.6);
    font-size: 16px;
    text-align: center;
    line-height: 1.5;
    height: 85px;
}

.inersong {
    position: relative;
}

.gcdetail {
    margin-top: 14px;
    height: 95px;
    overflow: hidden;
}

.song1 {
    padding-bottom: 8px;
}

.songname,
.active {
    color: white;
    font-size: 18px;
}
</style>
