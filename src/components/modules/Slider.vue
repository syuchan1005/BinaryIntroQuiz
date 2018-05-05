<template>
  <div class="slider" :style="sliderStyle" ref="slider">
    <div class="base" :style="baseStyle">
      <div class="text" :style="textStyle">{{ this.text }}</div>
      <div class="thumb" :style="thumbStyle"
           @mousedown="mouseDown" @touchstart="touchStart" @touchend="touchEnd" @touchcancel="touchCancel"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Slider',
    props: {
      value: {
        type: Number,
        default: 0,
      },
      width: {
        type: String,
        default: '100%',
      },
      height: {
        type: String,
        default: '75px',
      },
      baseColor: {
        type: String,
        default: 'rgba(255, 255, 255, 0.75)',
      },
      thumbColor: {
        type: String,
        default: '#FFF',
      },
      thumbMargin: {
        type: String,
        default: '8px',
      },
      text: {
        type: String,
        default: '',
      },
    },
    data() {
      return {};
    },
    computed: {
      sliderStyle() {
        return {
          width: this.width,
          height: this.height,
        };
      },
      baseStyle() {
        return {
          'background-color': this.baseColor,
          'border-radius': `calc(${this.height} / 2)`,
          width: `calc((${this.width} - ${this.height}) * ${(100 - this.value) / 100} + ${this.height})`,
        };
      },
      textStyle() {
        return {
          display: this.value > 5 ? 'none' : 'block',
          width: `calc(100% - ${this.height})`,
          'margin-left': this.height,
        };
      },
      thumbStyle() {
        const w = `calc(${this.height} - (${this.thumbMargin} * 2))`;
        return {
          width: w,
          height: w,
          margin: this.thumbMargin,
          'background-color': this.thumbColor,
        };
      },
    },
    methods: {
      minmax(v, min, max) {
        if (v < min) return min;
        else if (v > max) return max;
        return v;
      },
      mouseDown(event) {
        document.onmousemove = (e) => {
          const moveSub = e.clientX - event.clientX;
          const fixedWidth = this.$refs.slider.clientWidth - this.$refs.slider.offsetHeight;
          const percent = Math.round((moveSub / fixedWidth) * 100);
          this.setPercentage(this.minmax(percent, 0, 100));
        };
        document.onmouseup = () => {
          this.setPercentage(0);
          document.onmousemove = null;
          if (this.value === 100) this.$emit('select', this.value);
        };
      },
      touchStart() {
        this.setPercentage(0);
      },
      touchEnd() {
        this.setPercentage(0);
      },
      touchCancel() {
        this.setPercentage(0);
      },
      setPercentage(percent) {
        if (this.value !== percent) {
          this.$emit('input', percent);
          if (percent === 100) this.$emit('max', percent);
        }
      },
    },
  };
</script>

<style scoped>
  .slider {
    position: relative;
  }

  .base {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }

  .text {
    position: absolute;
    font-size: 1rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: clip;
    text-align: center;
    top: calc(50% - 0.5rem);

    user-select: none;
    -webkit-touch-callout: none;

    background: linear-gradient(to right, #000 20%, #FFF 40%, #FFF 60%, #000 80%);
    background-size: 200% auto;
    color: #000;
    background-clip: text;
    text-fill-color: transparent;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: text-gradient 2.5s linear infinite;
  }

  .thumb {
    border-radius: 50%;
    cursor: pointer;
  }

  @keyframes text-gradient {
    to {
      background-position: -200% center;
    }
  }
</style>
