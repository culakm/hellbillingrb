<template>
	<!-- <router-link :to="tripViewLink"> -->
	<li class="line-item">
		<!-- toto rozhodovanie sa da urobit aj
		<component :is="selectedComponent" @update-content="updateContent"></component>
		ale co s tlacitkami, eventami a tak? je to zlozitejsie ako treba
		-->
		<template v-if="!isEdited">
			<line-view :line="localLine"></line-view>
			<div class="actions">
				<base-button @click="setEditedLine()">Edit</base-button>
				<base-button @click="deleteLineLocal">Delete</base-button>
			</div>
		</template>
		<template v-else>
			<line-edit :line="localLine" @save-line="editLineLocal" @cancel-edit="cancelEditLocal"></line-edit>
		</template>

	</li>
	<!-- </router-link> -->
</template>
<script>
import { mapActions } from 'vuex';
import LineView from './LineView.vue';
import LineEdit from './LineEdit.vue';

export default {
	name: 'LineActions',
	components: {
		LineView,
		LineEdit,
	},
	props: {
		tripId: {
			type: String,
			required: true,
		},
		line: {
			type: Object,
			required: true,
			default: () => ({}),
		},
	},
	data() {
		return {
			isLoading: false,
			error: null,
			isEdited: false,
			localLine: { ...this.line },
		};
	},
	methods: {
		...mapActions('trips', ['deleteLine', 'editLine']),
		async editLineLocal(lineData) {
			lineData.tripId = this.tripId;
			this.isLoading = true;
			try {
				await this.editLine(lineData);
			} catch (error) {
				this.error = `Component ${this.$options.name}, Padlo fetch : ${error.message}` || 'Something went wrong!';
				return;
			}
			this.isLoading = false;
			this.setEditedLine();

		},
		async deleteLineLocal() {
			this.isLoading = true;
			try {
				await this.deleteLine({ tripId: this.tripId, lineId: this.line.lineId });
			} catch (error) {
				this.error = `Component ${this.$options.name}, Padlo fetch : ${error.message}` || 'Something went wrong!';
				return;
			}
			this.isLoading = false;
		},
		async setEditedLine() {
			this.isEdited = !this.isEdited;
			this.$emit('line-is-edited');
		},
		async cancelEditLocal(lineData) {
			this.localLine = lineData;
			this.isEdited = false;
			this.$emit('line-is-edited');
		},
	}
};
</script>

<style scoped>
	.draggable-list {
		background: #3f51b5;
		color: #fff;
		border: 1px solid;
		height: 50vh;
	}

	.list-item {
		margin: 10px;
		padding: 40px;
		cursor: pointer;
		font-size: 18px;
		border-radius: 5px;
		background: #f44336;
		display: inline-block;
	}

	.line-item {
		display: flex;
		/* Make the li a flex container */
		justify-content: space-between;
		/* Distribute the items evenly */
		align-items: center;
		/* Align the items vertically */
	}

	li {
		list-style-type: none;
		/* Remove the default bullet point */
		padding: 10px;
		/* Add some padding */
		margin-bottom: 10px;
		/* Add some space between list items */
		border: 1px solid #ddd;
		/* Add a border */
		border-radius: 5px;
		/* Round the corners */
		background-color: #f9f9f9;
		/* Add a background color */
		transition: background-color 0.3s ease;
		/* Add a transition for the hover effect */
	}

	li:hover {
		background-color: #e9e9e9;
		/* Change the background color when hovered over */
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
		justify-content: flex-end;
	}
</style>