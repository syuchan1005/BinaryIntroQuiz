<template>
  <div id="hello">
    <div class="title">Binary Intro Quiz</div>

    <div class="sliders">
      <slider v-for="(value, key) in difficulty" :key="key" width="250px" height="75px" :ref="key"
              :style="{ 'z-index': value.value > 0 ? 1 : 0 }"  v-model="value.value" @select="setDifficulty(key)"
              :text="value.text" :base-color="value.color" />
    </div>

    <div class="cover" :style="{'background-color':`rgba(0, 0, 0, ${sumValues / 100})`}"></div>

    <div class="effect" :class="{open:enableEffect}" :style="effect" @transitionend="effectEnd"></div>
  </div>
</template>

<script>
  import Slider from './modules/Slider';

  export default {
    name: 'hello',
    components: { Slider },
    data() {
      return {
        difficulty: {
          easy: {
            color: '#2196F3',
            text: 'Easy',
            value: 0,
          },
          normal: {
            color: '#4CAF50',
            text: 'Normal',
            value: 0,
          },
          hard: {
            color: '#F44336',
            text: 'Hard',
            value: 0,
          },
          /*
          chaos: {
            color: '#FF5722',
            text: 'Chaos',
            value: 0,
          },
          */
        },
        effect: {
          top: '0',
          left: '0',
          'background-color': '#FFF',
        },
        enableEffect: false,
        effectType: '',
      };
    },
    computed: {
      sumValues() {
        return Object.keys(this.difficulty)
          .map(key => this.difficulty[key].value)
          .reduce((a, b) => a + b);
      },
    },
    methods: {
      setDifficulty(type) {
        this.effectType = type;
        this.difficulty[type].value = 100;
        const slider = this.$refs[type][0].$el;
        this.effect.top = `${slider.offsetTop}px`;
        this.effect.left = `${(slider.offsetLeft + slider.offsetWidth) - slider.offsetHeight}px`;
        this.effect['background-color'] = this.difficulty[type].color;
        this.enableEffect = true;
      },
      effectEnd() {
        this.$router.push(`/game/${this.effectType}`);
      },
    },
  };
</script>

<style lang="scss" scoped>
  #hello {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background: #424242;
    line-height: normal;

    .title {
      font-size: 3.5rem;
      color: #EEEEEE;
    }

    .sliders {
      .slider {
        margin: 10px;
      }
    }

    .cover {
      pointer-events: none;
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .effect {
      z-index: -1;
      position: fixed;
      width: 75px;
      height: 75px;
      border-radius: 50%;
      transition: transform ease 0.8s;
      transition-delay: 0.1s;

      &.open {
        z-index: 2;
        transform: scale(50);
      }
    }
  }
</style>
