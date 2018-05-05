<template>
  <div class="frame">
    <slot/>
  </div>
</template>

<script>
  export default {
    name: 'frame',
  };
</script>

<style scoped>
  .frame {
    display: inline-flex;
    justify-content: center;
    align-items: center;

    margin: 24px 12px 12px 24px;
    padding: 10px;

    box-shadow: rgba(255, 255, 255, 0.2) 0 3px 5px -1px,
    rgba(255, 255, 255, 0.14) 0 6px 10px 0,
    rgba(255, 255, 255, 0.12) 0 1px 18px 0;

    box-sizing: border-box;
    color: rgba(0, 0, 0, 0.87);
  }
</style>
