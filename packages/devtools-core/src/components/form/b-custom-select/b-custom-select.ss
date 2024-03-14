- namespace [%fileName%]

- include '@super/components/form/b-select'|b as placeholder

- template index() extends ['b-select'].index
	- block input
		< .&__value
			{{ value }}
