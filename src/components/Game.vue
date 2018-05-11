<template>
  <div id="game" :style="{'background-color':color[type]}">
    <md-icon class="back-icon" @click.native="$router.push('/')">arrow_back</md-icon>
    <div class="test" :style="{ transform: `rotate(${calcRotate}rad)`}">{{ type }}</div>

    <div class="windows" :class="{easy: type === 'easy'}">
      <div class="window right" ref="windowRight" @scroll="scrollRight">
        <table>
          <thead>
            <tr>
              <th>Offset</th>
              <th v-for="i in 16">{{numFormat(i - 1).slice(type === 'hard' ? -8 : -2)}}</th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="(a, i) in blob" :key="'blob-' + i">
            <th>{{numFormat(i)}}</th>
            <th class="cell" v-for="(b, k) in a" :key="'blob-' + i + '-' + k"  :class="{select: (i + '-' + k) === selectedCell}" @click="clickCell(i + '-' + k)">
              {{numFormat(b).slice(type === 'hard' ? -8 : -2)}}
            </th>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="window left" ref="windowLeft">
        <table>
          <thead>
          <tr>
            <th>Offset</th>
            <th v-for="i in 16">{{'0' + (i - 1).toString(16).toUpperCase()}}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(a, i) in blob" :key="'str-' + i">
            <th>{{('00000000' + i.toString(16)).slice(-8).toUpperCase()}}</th>
            <th class="cell" v-for="(b, k) in a" :key="'str-' + i + '-' + k" :class="{select: (i + '-' + k) === selectedCell}" @click="clickCell(i + '-' + k)">
              {{ String.fromCharCode(b) }}
            </th>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="window bottom">
        <span>This file extension is</span>

        <div class="in-ext">
          <span>.</span>
          <md-input-container>
            <md-input placeholder="extension" v-model="input" @keydown.native.enter="checkAnswer" @input="giveUp = false"/>
          </md-input-container>
        </div>

        <md-button class="md-raised" :class="{'md-primary':!giveUp, 'md-warn':giveUp}" ref="send-btn" @click="checkAnswer">
          {{ giveUp ? 'Give up' : 'Send' }}
        </md-button>
      </div>
    </div>

    <md-dialog ref="resultDialog">
      <md-dialog-title>Results</md-dialog-title>

      <md-dialog-content class="dialog success" v-if="successAnswer">
        <md-icon class="md-size-4x">done</md-icon>
        <div class="cap">Success!</div>
        <div>This file extension is</div>
        <div class="ext">{{ext}}</div>
      </md-dialog-content>

      <md-dialog-content class="dialog failure" v-if="!successAnswer">
        <md-icon class="md-size-4x">clear</md-icon>
        <div class="cap">Failure...</div>
        <div>This file extension is</div>
        <div class="ext">{{ext}}</div>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="reloadPage">
          <md-icon>replay</md-icon>
          Replay
        </md-button>
        <md-button @click="$router.push('/')">
          go to top
        </md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Game',
    title() {
      return `Game(${this.type})`;
    },
    props: {
      type: {
        type: String,
      },
    },
    data() {
      return {
        color: {
          easy: '#2196F3',
          normal: '#4CAF50',
          hard: '#F44336',
          chaos: '#FF5722',
        },
        input: '',
        ext: '',
        blob: [],
        selectedCell: '',
        giveUp: false,
      };
    },
    computed: {
      calcRotate() {
        return screen.height / Math.sqrt((screen.width ** 2) + (screen.height ** 2));
      },
      successAnswer() {
        const validate = this.input.replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 65248)).toLowerCase();
        return this.ext === validate;
      },
    },
    mounted() {
      this.$http({
        method: 'GET',
        url: 'static/question.json',
      }).then(response => response.data[Math.floor(Math.random() * response.data.length)])
        .then(ext => this.loadQuestion(ext));
    },
    methods: {
      loadQuestion(ext) {
        this.ext = ext;
        this.$http({
          method: 'GET',
          url: `static/questions/${this.ext}.bin`,
          responseType: 'arraybuffer',
        }).then((response) => {
          const data = new Uint8Array(response.data);
          this.blob = [];
          for (let i = 0; i < data.length; i += 16) {
            this.blob.push(data.slice(i, i + 16));
          }
        });
      },
      checkAnswer() {
        if (this.input !== '' || this.giveUp) {
          this.$refs.resultDialog.open();
        } else {
          this.giveUp = true;
        }
      },
      numFormat(num) {
        if (this.type === 'hard') {
          return (`00000000${num.toString(2).toUpperCase()}`).slice(-8);
        }
        return (`00000000${num.toString(16).toUpperCase()}`).slice(-8);
      },
      scrollRight() {
        this.$refs.windowLeft.scrollTop = this.$refs.windowRight.scrollTop;
        this.$refs.windowLeft.scrollLeft = this.$refs.windowRight.scrollLeft;
      },
      clickCell(target) {
        this.selectedCell = this.selectedCell === target ? '' : target;
      },
      reloadPage() {
        location.reload();
      },
    },
  };
</script>

<style lang="scss" scoped>
  #game {
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    .back-icon {
      position: fixed;
      top: 10px;
      left: 10px;
      font-size: 45px;
      color: white;
      cursor: pointer;
    }

    .test {
      position: fixed;
      font-size: 8rem;
      color: rgba(255, 255, 255, 0.35);
      user-select: none;
      -webkit-touch-callout: none;
    }

    .in-ext {
      margin: 0 10px;

      display: flex;
      align-items: center;
    }

    .windows {
      z-index: 1;
      width: 90%;
      height: 90%;

      display: grid;
      grid-template-rows: 85% 15%;
      grid-template-columns: 50% 50%;

      .window {
        box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 5px 8px rgba(0,0,0,.14), 0 1px 14px rgba(0,0,0,.12);
        margin: 10px;
        overflow: auto;
      }

      &.easy {
        .right {
          background-color: #FFF;
          grid-row: 1 / 2;
          grid-column: 1 / 2;
        }

        .left {
          display: block;
          background-color: #FFF;
          grid-row: 1 / 2;
          grid-column: 2 / 3;

          overflow: hidden;
        }
      }

      .right {
        background-color: #FFF;
        grid-row: 1 / 2;
        grid-column: 1 / 3;
      }

      .left {
        display: none;
      }

      .bottom {
        grid-row: 2 / 3;
        grid-column: 1 / 3;

        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;

        background-color: white;
        font-size: 1.5rem;
      }

      table {
        tr > th:nth-child(1) {
          padding-right: 5px;
        }

        th.cell {
          border: solid 1px transparent;
          cursor: pointer;

          user-select: none;
          -webkit-touch-callout: none;

          &.select {
            border: solid 1px #2196F3;
          }
        }
      }
    }
  }

  .dialog {
    line-height: normal;

    display: flex;
    flex-direction: column;
    align-items: center;

    .cap {
      font-size: 1.5rem;
    }

    .cap + div {
      margin-top: 10px;
      font-size: 1rem;
    }

    .ext {
      font-size: 2rem;
      background-color: #B0BEC5;
      padding: 0 5px;
      border-radius: 20%;
    }

    &.success {
      .md-icon {
        color: green;
      }
    }

    &.failure {
      .md-icon {
        color: red;
      }
    }
  }
</style>
