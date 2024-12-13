<template>
  <a-modal
    v-model:open="tasksStore.isModalOpen"
    :title="tasksStore.modalMode === 'edit' ? 'Редагувати завдання' : 'Створити завдання'"
    :ok-text="tasksStore.modalMode === 'edit' ? 'Зберегти' : 'Створити'"
    cancel-text="Скасувати"
    @ok="onOk"
    @cancel="onClose"
    :destroy-on-close="true"
  >
    <a-form ref="formRef" :model="formState" layout="vertical">
      <a-form-item
        name="taskName"
        label="Назва завдання"
        :rules="[{ required: true, message: 'Please enter the task name!' }]"
      >
        <a-input v-model:value="formState.taskName" />
      </a-form-item>
      <a-form-item
        name="assignee"
        label="Виконавець"
        :rules="[{ required: true, message: 'Please select the assignee!' }]"
      >
        <a-select v-model:value="formState.assignee" placeholder="Select assignee">
          <a-select-option value="Олександр">Олександр</a-select-option>
          <a-select-option value="Андрій">Андрій</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        name="dueDate"
        label="Термін виконання"
        :rules="[{ required: true, message: 'Please enter the due date!' }]"
      >
        <a-date-picker
          v-model:value="formState.dueDate"
          format="YYYY-MM-DD"
          :disabled-date="(current) => current && current.isBefore(dayjs().startOf('day'))"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTasksStore } from '../../stores/tasks'
import { Form, FormInstance } from 'ant-design-vue'
import dayjs from 'dayjs'

const tasksStore = useTasksStore()
const route = useRoute()
const projectId = ref(route.params.id as string)

const formRef = ref<FormInstance>()
const formState = reactive({
  taskName: '',
  assignee: '',
  dueDate: '',
})
const { resetFields } = Form.useForm(formState)

watch(
  () => tasksStore.taskToEdit,
  (newTask) => {
    if (newTask && tasksStore.modalMode === 'edit') {
      formState.taskName = newTask.taskName
      formState.assignee = newTask.assignee
      formState.dueDate = dayjs(newTask.dueDate)
    }
  },
)

const transformDate = (date: string): string => {
  const originalDate = new Date(date)
  originalDate.setUTCDate(originalDate.getUTCDate() + 1)
  return originalDate.toISOString().split('T')[0]
}

const onOk = async () => {
  formRef.value?.validateFields().then(async () => {
    const transformedFormState = {
      ...formState,
      dueDate: transformDate(formState.dueDate),
      projectId: projectId.value,
    }

    if (tasksStore.modalMode === 'create') {
      await tasksStore.createTask(transformedFormState)
      resetForm()
    } else if (tasksStore.modalMode === 'edit' && tasksStore.taskToEdit) {
      await tasksStore.updateTask(tasksStore.taskToEdit.id, transformedFormState)
      resetForm()
    }
    tasksStore.closeModal()
  })
}
const onClose = () => {
  tasksStore.closeModal()
  resetForm()
}

const resetForm = () => {
  formRef.value?.resetFields()
  formState.taskName = ''
  formState.dueDate = ''
  formState.assignee = ''
}
</script>

<style lang="scss" scoped>
.ant-picker {
  width: 100%;
}
</style>
