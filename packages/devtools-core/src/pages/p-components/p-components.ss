- namespace [%fileName%]

- include 'components/super/i-dynamic-page'|b as placeholder

- template index() extends ['i-dynamic-page'].index
	- block body
		< .&__content
			< b-components-tree &
				ref = components |
				:items = components
			.
			< template v-if = selectedComponentId
				< template v-if = selectedComponentData != null
					< b-components-panel &
						ref = panel |
						:componentData = selectedComponentData
					.
				< . v-else
					< p.&__placeholder
						< i
							Loading...

			< . v-else
				< p.&__placeholder
					< i
						Select a component


