- namespace [%fileName%]

- include 'components/base/b-tree'|b as placeholder

- template index() extends ['b-tree'].index
	- block body
		< .&__header
			< b
				{{ componentData.componentName.camelize(false) }}

			< b-checkbox &
				:label = (showEmpty ? "hide" : "show") + " empty" |
				:checked = showEmpty |
				@change = showEmptyChange
			.

		- super
