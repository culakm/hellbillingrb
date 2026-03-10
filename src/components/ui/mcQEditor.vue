<template>
	<q-editor
		v-model="innerText"
		:toolbar="[
			['bold', 'italic', 'underline', 'strike'],
			['backColor', 'backColorDropdown'],
			['undo', 'redo'],
		]"
	>
		<template #backColor>
			<q-btn class="backColor" dense flat size="sm">
				<q-icon name="format_color_fill" :color="highlightColor === 'white' ? 'black' : highlightColor" @click="applyHighlight" />
				<q-tooltip>Apply highlight color on selected text</q-tooltip>
			</q-btn>
		</template>

		<template #backColorDropdown>
			<q-btn-dropdown ref="backColorDropdown" class="backColorDropdown" dense no-wrap unelevated size="sm">
				<div class="row q-pa-sm q-gutter-sm">
					<q-btn
						v-for="c in ['none', 'red', 'blue', 'teal', 'green', 'yellow', 'orange', 'brown']"
						:key="c"
						size="sm"
						:style="{ backgroundColor: c }"
						@click="
							highlightColor = c;
							applyHighlight();
							$nextTick(() => backColorDropdown.hide());
						"
					/>
				</div>
			</q-btn-dropdown>
		</template>
	</q-editor>
	<q-card flat bordered>
		<q-card-section>
			<pre style="white-space: pre-line">{{ innerText }}</pre>
		</q-card-section>
	</q-card>

	<q-card flat bordered>
		<q-card-section v-html="innerText" />
	</q-card>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
	modelValue: {
		type: String,
		default: "",
	},
	resetColor: {
		type: Boolean,
		default: false,
	},
});
const emit = defineEmits(["update:modelValue", "unset-reset-color"]);
// local copy bound to q-editor
const innerText = ref(props.modelValue);

// keep local in sync when parent changes
watch(
	() => props.modelValue,
	(val) => {
		if (val !== innerText.value) innerText.value = val;
	},
);

watch(
	() => props.resetColor,
	(val) => {
		if (val) {
			highlightColor.value = "none";
			emit("unset-reset-color");
		}
	},
);

// emit changes to parent when user edits
watch(innerText, (val) => {
	if (val !== props.modelValue) emit("update:modelValue", val);
});

const highlightColor = ref("");
const backColorDropdown = ref(null);

const isCaretAtEnd = (editor) => {
	const sel = window.getSelection();
	if (editor.lastChild) {
		let lastText;
		if (editor.lastChild.nodeType === Node.TEXT_NODE) {
			lastText = editor.lastChild.textContent;
		} else if (editor.lastChild.nodeType === Node.ELEMENT_NODE) {
			lastText = editor.lastChild.innerText || editor.lastChild.textContent;
		}
		if (sel.anchorNode === editor.lastChild) {
			if (sel.focusOffset === (lastText ? lastText.length : 0)) {
				return true;
			}
		} else if (sel.anchorNode && sel.anchorNode.parentElement === editor.lastChild) {
			if (sel.focusOffset === (lastText ? lastText.length : 0)) {
				return true;
			}
		}
	} else {
		console.log("Editor is empty");
	}
	return false;
};

const addZeroWidthSpaceToEnd = (editor) => {
	if (editor) {
		editor.focus();
		if (editor.lastChild) {
			const lastNode = editor.lastChild;
			const range = document.createRange();
			if (lastNode.nodeType === Node.TEXT_NODE) {
				// Place caret at the end of the text node
				range.setStart(lastNode, lastNode.textContent.length);
				range.collapse(true);
			} else if (lastNode.nodeType === Node.ELEMENT_NODE) {
				// Place caret after the element node
				range.setStartAfter(lastNode);
				range.collapse(true);
			}
			const sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		}
	}
};

const applyHighlight = () => {
	const color = highlightColor.value || "none";
	const sel = window.getSelection();
	const hasSelection = sel && sel.rangeCount > 0 && !sel.getRangeAt(0).collapsed;
	const editor = document.querySelector(".q-editor__content");

	if (!hasSelection && color === "none") {
		addZeroWidthSpaceToEnd(editor);
		if (editor) {
			innerText.value = editor.innerHTML;
		}
		return;
	}

	if (!hasSelection) return;

	const range = sel.getRangeAt(0);

	// pre farby nastavi farbu a obali vybraty text spanom
	if (color !== "none") {
		const span = document.createElement("span");
		span.style.backgroundColor = color;
		range.surroundContents(span);
		const zwspNode = document.createTextNode("\u200B");
		editor.appendChild(zwspNode);
	}
	// pre "none" odstrani span a vlozi cisty text naspat
	else {
		const frag = range.extractContents();
		const spans = frag.querySelectorAll('span[style*="background-color"]');
		spans.forEach((span) => {
			const parent = span.parentNode;
			while (span.firstChild) parent.insertBefore(span.firstChild, span);
			parent.removeChild(span);
		});
		range.insertNode(frag);
	}
	// vymaze vsetky prazdne span s background-color
	if (editor) {
		const updatedText = editor.innerHTML.replace(/<span style="background-color: [^;]*;"><\/span>/g, "");
		innerText.value = updatedText;
		if (sel) sel.removeAllRanges();
	}
};
</script>

<style scoped>
.q-editor .q-btn.backColor {
	margin-right: 0;
	padding-right: 0;
}

.q-editor .q-btn-dropdown.backColorDropdown {
	margin-left: 0;
	padding-left: 0;
}
</style>
