- namespace [%fileName%]

- include 'components/super/i-block'|b as placeholder

- template index() extends ['i-block'].index
	- block body
		< b-icon-button :icon = 'crosshair' | @click = enableLocateComponent

		< b-window &
			ref = modal |
			@close = disableLocateComponent
		.
			< template #body
				< b.&__modal-body
					Click on a component on the page to select it
			< template #controls
				< b-button @click = disableLocateComponent
					Cancel
