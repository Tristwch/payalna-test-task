<template>
  <a-modal
    v-model:open="projectsStore.isModalOpen"
    :title="projectsStore.modalMode === 'edit' ? 'Редагувати проект' : 'Створити проект'"
    :ok-text="projectsStore.modalMode === 'edit' ? 'Зберегти' : 'Створити'"
    cancel-text="Скасувати"
    @ok="onOk"
    @cancel="onClose"
    :destroy-on-close="true"
  >
    <a-form ref="formRef" :model="formState" layout="vertical" name="form_in_modal">
      <a-form-item
        name="projectName"
        label="Назва проекту"
        :rules="[{ required: true, message: 'Будь ласка, введіть назву проекту!' }]"
      >
        <a-input v-model:value="formState.projectName" />
      </a-form-item>
      <a-form-item name="description" label="Опис">
        <a-textarea v-model:value="formState.description" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import { useProjectsStore } from '../../stores/projects'
import { Form, FormInstance } from 'ant-design-vue'

const projectsStore = useProjectsStore()
const formRef = ref<FormInstance>()
const formState = reactive({
  projectName: '',
  description: '',
})
const { resetFields } = Form.useForm(formState)
watch(
  () => projectsStore.projectToEdit,
  (newProject) => {
    if (newProject && projectsStore.modalMode === 'edit') {
      formState.projectName = newProject.projectName
      formState.description = newProject.description || ''
    }
  },
)

const onOk = async () => {
  formRef.value
    ?.validateFields()
    .then(async () => {
      try {
        if (projectsStore.modalMode === 'edit' && projectsStore.projectToEdit) {
          await projectsStore.updateProject(projectsStore.projectToEdit.id, formState)
        } else {
          await projectsStore.createProject(formState)
        }
        projectsStore.closeModal()
        formRef.value.resetFields()
      } catch (error) {
        console.error('Error saving project:', error)
      }
    })
    .catch((info) => {
      console.log('Validation failed:', info)
    })
}

const onClose = () => {
  projectsStore.closeModal()
  formRef.value.resetFields()
  resetFields()
}
</script>
