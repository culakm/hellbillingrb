<template>
    <li class="line-item">
        <base-dialog @close="clearError" :show="!!error" title="An error is ocurred!">
            <p>{{ error }}</p>
        </base-dialog>
        <div v-if="isLoading">
            <base-spinner></base-spinner>
        </div>
        <template v-if="!isEdited">
            <line-view :line="line"></line-view>
            <div class="actions">
                <base-button @click="setEditedLine()">Edit</base-button>
                <base-button @click="deleteLineLocal">Delete</base-button>
            </div>
        </template>
        <template v-else>
            <line-form @save-line="editLineLocal" @cancel-edit="cancelEditLocal" :line="line"></line-form>
        </template>
    </li>
</template>

<script>
import { ref, toRef } from 'vue';
import { useLinesStore } from '@/stores/lines';
import { useError } from '@/composables/useError';
import LineView from './LineView.vue';
import LineForm from './LineForm.vue';

export default {
    name: 'LineActions',
    components: {
        LineView,
        LineForm,
    },
    props: {
        tripId: {
            type: String,
            required: true,
        },
        line: {
            type: Object,
            required: true,
            default: () => ({
                interest: [],
            }),
        },
    },
    setup(props, { emit }) {
        const componentName = 'LineActions';
		const linesStore = useLinesStore();
        const { error, setError, clearError } = useError(componentName);

        const isLoading = ref(false);
        const isEdited = ref(false);

        async function editLineLocal(lineData) {
            isLoading.value = true;
            try {
                lineData.tripId = props.tripId;
				await linesStore.editLine(lineData);
            } catch (err) {
                setError(err.message || err);
            }
            isLoading.value = false;
            setEditedLine();
        }

        async function deleteLineLocal() {
            isLoading.value = true;
            try {
				await linesStore.deleteLine(props.tripId, props.line.lineId);
            } catch (err) {
                setError(err.message || err);
            }
            isLoading.value = false;
        }

        function setEditedLine() {
            isEdited.value = !isEdited.value;
            emit('line-is-edited');
        }

        function cancelEditLocal() {
            isEdited.value = false;
            emit('line-is-edited');
        }

        return {
            componentName,
            error,
            clearError,
            isLoading,
            isEdited,
			line: toRef(props, 'line'),
            editLineLocal,
            deleteLineLocal,
            setEditedLine,
            cancelEditLocal
        };
    }
};
</script>

<style scoped>
    .line-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    li {
        list-style-type: none;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: #f9f9f9;
        transition: background-color 0.3s ease;
    }

    li:hover {
        background-color: #e9e9e9;
    }

    h3 {
        font-size: 1.5rem;
    }

    h3,
    h4 {
        margin: 0.5rem 0;
    }

    div {
        margin: 0.5rem 0;
    }

    .actions {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        justify-content: flex-end;
    }
</style>
