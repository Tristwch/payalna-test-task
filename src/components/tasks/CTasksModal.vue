<template>
  <a-modal
    v-model:open="tasksStore.isModalOpen"
    :title="tasksStore.modalMode === 'edit' ? 'Edit Task' : 'Create Task'"
    :ok-text="tasksStore.modalMode === 'edit' ? 'Save' : 'Create'"
    cancel-text="Cancel"
    @ok="onOk"
    @cancel="onClose"
    :destroy-on-close="true"
  >
    <a-form ref="formRef" :model="formState" layout="vertical">
      <a-form-item
        name="taskName"
        label="Task Name"
        :rules="[{ required: true, message: 'Please enter the task name!' }]"
      >
        <a-input v-model:value="formState.taskName" />
      </a-form-item>
      <a-form-item
        name="assignee"
        label="Assignee"
        :rules="[{ required: true, message: 'Please enter the assignee!' }]"
      >
        <a-input v-model:value="formState.assignee" />
      </a-form-item>
      <a-form-item
        name="dueDate"
        label="Due Date"
        :rules="[{ required: true, message: 'Please enter the due date!' }]"
      >
        <a-date-picker v-model:value="formState.dueDate" format="YYYY-MM-DD" />
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
