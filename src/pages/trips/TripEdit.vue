<template>
	<div>
		<base-dialog @close="handleError" :show="!!error" title="An error is ocurred!">
			<p>{{ error }}</p>
		</base-dialog>
		<section>
			<base-card>
				<div v-if="isLoading">
					<base-spinner></base-spinner>
				</div>
				<div v-else-if="trip">
					<h2>{{ trip.name }}</h2>
					<trip-form @save-data="updateTripLocal" :trip="trip"></trip-form>
				</div>
			</base-card>
		</section>
		<section>
			<base-card>
				<div v-if="isLoading">
					<base-spinner></base-spinner>
				</div>
				<line-form @save-line="addLineLocal" :trip="trip"></line-form>
			</base-card>
		</section>
		<section>
			<ul v-if="hasLines">
				<draggable :list="trip.lines" :disabled="!draggableEnabled" item-key="order" class="list-group"
					ghost-class="ghost" @start="dragging = true" @end="onEnd">
					<template #item="{ element }">
						<div class="list-group-item" :class="{ 'not-draggable': !draggableEnabled }">
							<line-actions class="line-item" :key="element.id" :line="element" :trip-id="trip.id"
								@line-is-edited="lineIsEdited"></line-actions>
						</div>
					</template>
				</draggable>
			</ul>
		</section>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import draggable from "vuedraggable";
import TripForm from '../../components/trips/TripForm.vue';
import LineForm from '../../components/lines/LineForm.vue';
import LineActions from '../../components/lines/LineActions.vue';

export default {
	name: 'TripEdit',
	components: {
		draggable,
		TripForm,
		LineForm,
		LineActions,
	},
	data() {
		return {
			isLoading: false,
			error: null,
			draggableEnabled: true,
			dragging: false,
			tripId: null,

		};
	},
	computed: {
		...mapGetters('trips', ['trip', 'hasLines'])
	},
	created() {
		this.tripId = this.$route.params.tripId;
		this.tripByIdLocal();
	},
	methods: {
		...mapActions('trips', ['tripById', 'addLine', 'updateLines']),
		async tripByIdLocal() {
			this.isLoading = true;
			try {
				await this.tripById(this.tripId);
			} catch (error) {
				this.error = `Component ${this.$options.name}, error: ${error.message}` || 'Something went wrong!';
			}
			this.isLoading = false;
		},
		async updateTripLocal(tripData) {
			this.isLoading = true;
			try {
				await this.$store.dispatch('trips/updateTrip', tripData);
			} catch (error) {
				this.error = `Component huhuh ${this.$options.name}, Padlo fetch : ${error.message}` || 'Something went wrong!';
				return;
			}

			this.isLoading = false;

		},
		async addLineLocal(lineData) {
			this.isLoading = true;
			const lastOrder = this.trip.lines.length;
			lineData.order = lastOrder + 1;
			lineData.tripId = this.trip.id;

			try {
				await this.addLine(lineData);
			} catch (error) {
				this.error = `Component ${this.$options.name}, Padlo fetch : ${error.message}` || 'Something went wrong!';
				return;
			}
			this.isLoading = false;
		},
		lineIsEdited() {
			this.draggableEnabled = !this.draggableEnabled;
		},
		handleError() {
			this.error = null;
		},
		onEnd(evt) {
			this.dragging = false;
			this.trip.lines.forEach((line, index) => {
				line.order = index + 1;
			});
			this.updateLines({ lines: this.trip.lines, tripId: this.trip.id });
		},

	},
};
</script>

<style scoped>
	.buttons {
		margin-top: 35px;
	}

	.ghost {
		opacity: 0.5;
		background: #c8ebfb;
	}

	.not-draggable {
		cursor: no-drop;
	}
</style>