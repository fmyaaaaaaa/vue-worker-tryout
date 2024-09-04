<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import MessageModel from "../models/MessageModel.ts";
import { MessageGenerationEvent } from "../models/MessageGenerationEvent.ts";
import { MessageModelDTO } from "./worker/model/MessageModelDTO.ts";

defineProps<{ title: string }>()

const state = reactive({
  msgCount: 10,
  msg: "Vue Worker Test",
  msgKey: "VWT",
  millisecond: 3000,
  msgStores: [] as MessageModel[],
  getIndex: 0,
  isGenerating: false,
  indexedMessage: ""
});

const worker = ref<Worker | null>(null);

/**
 * Run a worker function
 */
const onGenerateMessage = () => {
  if (state.msgStores.length !== 0) clearMessageStores();
  state.isGenerating = true;
  const config: MessageGenerationEvent = {
    msgCount: state.msgCount,
    key: state.msgKey,
    msg: state.msg,
    millisecond: state.millisecond
  }
  worker.value?.postMessage(config)
  worker.value!.onmessage = onMessageReceived;
}

/**
 * When worker passes the result to main thread, then convert a message dto to a model instance and push it to store
 * Worker is javascript native function. Worker always return serialized message so that converting to model is required
 * @param event MessageEvent class
 */
const onMessageReceived = (event: MessageEvent) => {
  const dto: MessageModelDTO = event.data;
  const model = new MessageModel(dto);
  state.msgStores.push(model);

  if (state.msgStores.length === state.msgCount) {
    state.isGenerating = false;
  }
}

const onStopMessage= () => {
  worker.value?.terminate();
  createWorker();
  state.isGenerating = false;
}

const clearMessageStores = () => {
  state.msgStores = [];
}

/**
 * Create Worker instance
 */
const createWorker = () => {
  worker.value =  new Worker(new URL("./worker/messageGenerator.ts", import.meta.url), {
    type: "module"
  });
}

const getMessageFromStores = () => {
  if (state.getIndex != null && 0 <= state.getIndex && state.getIndex < state.msgStores.length) {
    state.indexedMessage = state.msgStores.find(m => m.id == state.getIndex).outputMessage()
  } else {
    state.indexedMessage = "Nothing here yet!"
  }
}

onMounted(() => {
  createWorker();
})

onUnmounted(() => {
  worker.value?.terminate()
})

</script>

<template>
  <h2>{{ title }}</h2>

  <div class="worker-container">
    <!-- Configuration　Container -->
    <div class="card worker-item-container">
      <h3>Your worker configuration</h3>
      <div class="worker-item-container__group__input">
        Message Count:
        <input v-model="state.msgCount" type="number" />
      </div>
      <div class="worker-item-container__group__input">
        Your Message:
        <input v-model="state.msg" />
      </div>
      <div class="worker-item-container__group__input">
        Your Message Key:
        <input v-model="state.msgKey" />
      </div>
      <div class="worker-item-container__group__input">
        Waiting Time(ms):
        <input v-model="state.millisecond" type="number" />
      </div>
      <div class="worker-item-container__group__button">
        <button class="worker-item-container__button" @click="onGenerateMessage" :disabled="state.isGenerating">Start</button>
        <button class="worker-item-container__button" @click="onStopMessage" :disabled="!state.isGenerating">Stop</button>
      </div>
    </div>

    <!-- Result　Container -->
    <div class="card worker-result-container">
      <h3>Your worker running status</h3>
      <div class="worker-result-container__group__count">
        Stored Message(s):
        <h2 class="worker-result-container__item__count">{{ state.msgStores.length }}</h2>
      </div>
      <div class="worker-result-container__group__get-message">
        Message Index:
        <input v-model="state.getIndex">
        <button class="worker-result-container__button" @click="getMessageFromStores">Get Message!!</button>
      </div>
      <div class="worker-result-container__group__result-message">
        Stored Message:
        <span class="worker-result-container__item__result-message">{{ state.indexedMessage }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
input {
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  transition: border-color 0.3s, box-shadow 0.3s;
}
input:focus {
  border-color: #66afe9;
  box-shadow: 0 0 8px rgba(102, 175, 233, 0.6);
}
.worker-container {
  display: grid;
  padding: 0 10rem;
  grid-template-columns: 50% 50%;
  column-gap: 2rem;
}
.worker-item-container {
  background: aliceblue;
  border-radius: 10px;
}
.worker-item-container__group__input {
  display: grid;
  margin: 0.5rem;
  grid-template-columns: 40% 60%;
  align-items: center;
}
.worker-item-container__group__button {
  text-align: end;
}
.worker-item-container__button {
  margin: 0 0.2rem;
}
.worker-result-container {
  background: #fffae5;
  border-radius: 10px;
}
.worker-result-container__group__count {
  display: grid;
  margin: 0.5rem;
  grid-template-columns: 45% 55%;
  align-items: center;
}
.worker-result-container__item__count {
  text-align: left;
  color: #4a51ef;
}
.worker-result-container__group__get-message {
  display: grid;
  margin: 0.5rem;
  grid-template-columns: 40% 20% 40%;
  align-items: center;
}
.worker-result-container__button {
  margin: 0 0.2rem;
}
.worker-result-container__group__result-message {
  display: grid;
  margin: 2rem 0;
  grid-template-columns: 40% 60%;
  align-items: center;
}
.worker-result-container__item__result-message {
  text-align: left;
  font-weight: bold;
  color: #4a51ef;
}
</style>
