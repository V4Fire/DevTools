- namespace [%fileName%]

- include 'components/super/i-block'|b as placeholder

- template index() extends ['i-block'].index
	- block body
		< .&__header
			< b
				{{ componentData.componentName.camelize(false) }}

			< b-checkbox &
				:label = (showEmpty ? "hide" : "show") + " empty" |
				:checked = showEmpty |
				@change = showEmptyChange
			.

		< .&__body
			< b-tree &
				ref = tree |
				:items = items |
				:item = 'b-components-panel-item' |
				:theme = 'pretty' |
				:cancelable = true |
				:lazyRender = true |
				:renderFilter = createTreeRenderFilter()
			.
