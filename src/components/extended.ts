import { computed, defineComponent, h, nextTick, onMounted, onBeforeUnmount, ref, Teleport, watch, type CSSProperties, type PropType, type VNode, type VNodeChild } from 'vue'

type NkOption = {
  label: string
  value: string | number
  disabled?: boolean
}

type NkItem = {
  key?: string | number
  name?: string | number
  label?: string
  title?: string
  content?: string
  disabled?: boolean
  children?: NkItem[]
}

type NkUploadFile = {
  name: string
  size: number
  type: string
}

/*
 * Icon glyphs — short recognisable tokens.
 * Style adapted from Lucide Icons (MIT License).
 * https://github.com/lucide-icons/lucide
 */
const iconGlyphs: Record<string, string> = {
  // Core set
  check: 'OK',
  close: 'x',
  'shield-check': 'SC',
  sparkles: '*',
  upload: '^',
  search: '?',
  zap: '!',
  // Extended set — inspired by Lucide Icons (MIT License)
  home: '⌂',
  user: '☺',
  settings: '⚙',
  heart: '♥',
  star: '★',
  mail: '✉',
  bell: '♪',
  calendar: '◷',
  folder: '▣',
  trash: '⌧',
  edit: '✎',
  plus: '+',
  minus: '−',
  arrowUp: '↑',
  arrowDown: '↓',
  arrowLeft: '←',
  arrowRight: '→',
  menu: '☰',
  more: '…',
  lock: '⇧',
  eye: '⊙',
  link: '⛓',
  copy: '⧉',
  alert: '⚠',
  info: 'ℹ',
  externalLink: '↗',
  clock: '◷',
  file: '▤',
  play: '▶',
  pause: '⏸',
  refresh: '↻',
}

function itemKey(item: NkItem, index: number) {
  return String(item.key ?? item.name ?? item.label ?? item.title ?? index)
}

function itemLabel(item: NkItem) {
  return item.label ?? item.title ?? String(item.name ?? item.key ?? '')
}

export const NkIcon = defineComponent({
  name: 'NkIcon',
  props: {
    name: { type: String, default: 'sparkles' },
    size: { type: [Number, String], default: 18 },
    color: { type: String, default: '' },
    strokeWidth: { type: [Number, String], default: 2 },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'span',
        {
          class: 'nk-icon',
          style: {
            '--nk-icon-size': typeof props.size === 'number' ? `${props.size}px` : props.size,
            color: props.color || undefined,
          },
          'aria-hidden': slots.default ? undefined : 'true',
          'data-stroke-width': props.strokeWidth,
        },
        slots.default?.() ?? iconGlyphs[props.name] ?? props.name.slice(0, 2).toUpperCase(),
      )
  },
})

export const NkLayout = defineComponent({
  name: 'NkLayout',
  props: {
    columns: { type: [Number, String], default: 2 },
    gap: { type: String, default: '16px' },
    responsive: { type: Boolean, default: true },
    align: { type: String as PropType<'start' | 'center' | 'end' | 'stretch'>, default: 'stretch' },
  },
  setup(props, { slots }) {
    const style = computed<CSSProperties>(() => ({
      '--nk-layout-columns': `repeat(${props.columns}, minmax(0, 1fr))`,
      gap: props.gap,
      alignItems: props.align,
    }))

    return () =>
      h(
        'div',
        {
          class: ['nk-layout', { 'nk-layout--responsive': props.responsive }],
          style: style.value,
        },
        slots.default?.(),
      )
  },
})

export const NkLink = defineComponent({
  name: 'NkLink',
  props: {
    href: { type: String, default: '#' },
    target: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    underline: { type: Boolean, default: false },
  },
  emits: ['click'],
  setup(props, { emit, slots }) {
    return () =>
      h(
        'a',
        {
          class: ['nk-link', { 'nk-link--disabled': props.disabled, 'nk-link--underline': props.underline }],
          href: props.disabled ? undefined : props.href,
          target: props.target || undefined,
          'aria-disabled': props.disabled || undefined,
          onClick: (event: MouseEvent) => {
            if (props.disabled) {
              event.preventDefault()
              return
            }
            emit('click', event)
          },
        },
        [slots.icon?.(), h('span', slots.default?.() ?? props.href)],
      )
  },
})

export const NkSelect = defineComponent({
  name: 'NkSelect',
  props: {
    modelValue: { type: [String, Number, Array] as PropType<string | number | Array<string | number>>, default: '' },
    options: { type: Array as PropType<NkOption[]>, default: () => [] },
    placeholder: { type: String, default: 'Select' },
    multiple: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'change', 'clear'],
  setup(props, { emit, expose, slots }) {
    const visible = ref(false)
    const triggerRef = ref<HTMLButtonElement>()
    const menuRef = ref<HTMLDivElement>()
    const activeIndex = ref(-1)

    const displayText = computed(() => {
      const val = props.modelValue
      if (val === '' || val === undefined || val === null) return ''
      const found = props.options.find((o) => String(o.value) === String(val))
      return found?.label ?? String(val)
    })

    const selectedTags = computed(() => {
      if (!props.multiple || !Array.isArray(props.modelValue)) return []
      return props.modelValue.map((v) => {
        const found = props.options.find((o) => String(o.value) === String(v))
        return { value: v, label: found?.label ?? String(v) }
      })
    })

    const maxVisibleTags = 3
    const visibleTags = computed(() => selectedTags.value.slice(0, maxVisibleTags))
    const overflowCount = computed(() => Math.max(0, selectedTags.value.length - maxVisibleTags))

    function isSelected(optionValue: string | number) {
      const val = props.modelValue
      if (props.multiple && Array.isArray(val)) {
        return val.some((v) => String(v) === String(optionValue))
      }
      return String(val) === String(optionValue)
    }

    function toggle() {
      if (props.disabled) return
      visible.value = !visible.value
      if (visible.value) {
        activeIndex.value = -1
      }
    }

    function close() {
      visible.value = false
    }

    function select(option: NkOption) {
      if (option.disabled) return
      if (props.multiple) {
        const current = (Array.isArray(props.modelValue) ? [...props.modelValue] : []) as Array<string | number>
        const idx = current.findIndex((v) => String(v) === String(option.value))
        let next: Array<string | number>
        if (idx >= 0) {
          next = current.filter((v) => String(v) !== String(option.value))
        } else {
          next = [...current, option.value]
        }
        emit('update:modelValue', next)
        emit('change', next)
      } else {
        emit('update:modelValue', option.value)
        emit('change', option.value)
        close()
      }
    }

    function removeTag(tagValue: string | number, event: Event) {
      event.stopPropagation()
      if (props.disabled) return
      const current = (Array.isArray(props.modelValue) ? [...props.modelValue] : []) as Array<string | number>
      const next = current.filter((v) => String(v) !== String(tagValue))
      emit('update:modelValue', next)
      emit('change', next)
    }

    function clear() {
      const value = props.multiple ? [] : ''
      emit('update:modelValue', value)
      emit('clear')
      close()
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        close()
        triggerRef.value?.focus()
        return
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        const enabledIndexes = props.options
          .map((o, i) => (o.disabled ? -1 : i))
          .filter((i) => i !== -1)
        if (!visible.value) {
          visible.value = true
          activeIndex.value = enabledIndexes[0] ?? -1
          return
        }
        const current = enabledIndexes.indexOf(activeIndex.value)
        const next = (current + 1) % enabledIndexes.length
        activeIndex.value = enabledIndexes[next] ?? -1
        return
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        const enabledIndexes = props.options
          .map((o, i) => (o.disabled ? -1 : i))
          .filter((i) => i !== -1)
        const current = enabledIndexes.indexOf(activeIndex.value)
        const prev = (current - 1 + enabledIndexes.length) % enabledIndexes.length
        activeIndex.value = enabledIndexes[prev] ?? -1
        return
      }
      if (event.key === 'Enter' && visible.value && activeIndex.value >= 0) {
        event.preventDefault()
        const target = props.options[activeIndex.value]
        if (target && !target.disabled) {
          select(target)
          if (!props.multiple) close()
        }
      }
    }

    expose({
      blur: () => triggerRef.value?.blur(),
      clear,
      focus: () => triggerRef.value?.focus(),
    })

    function handleClickOutside(event: MouseEvent) {
      if (!visible.value) return
      const el = triggerRef.value
      const menu = menuRef.value
      const target = event.target as Node
      if (el && !el.contains(target) && menu && !menu.contains(target)) {
        close()
      }
    }

    onMounted(() => document.addEventListener('click', handleClickOutside, true))
    onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside, true))

    function renderTriggerContent() {
      if (props.multiple) {
        if (selectedTags.value.length === 0) {
          return h('span', { class: 'nk-select__text nk-select__placeholder' }, props.placeholder)
        }
        const tags = visibleTags.value.map((tag) =>
          h(
            'span',
            { class: 'nk-select__tag', key: String(tag.value) },
            [
              h('span', { class: 'nk-select__tag-label' }, tag.label),
              h(
                'button',
                {
                  class: 'nk-select__tag-remove',
                  type: 'button',
                  tabindex: -1,
                  onClick: (e: Event) => removeTag(tag.value, e),
                },
                '\u00D7',
              ),
            ],
          ),
        )
        if (overflowCount.value > 0) {
          tags.push(h('span', { class: 'nk-select__overflow' }, `+${overflowCount.value} more`))
        }
        return h('span', { class: 'nk-select__tags' }, tags)
      }
      return h('span', { class: 'nk-select__text' }, displayText.value || props.placeholder)
    }

    function renderOptions() {
      return props.options.map((option, index) => {
        const selected = isSelected(option.value)
        const children: VNodeChild[] = []
        if (props.multiple) {
          children.push(
            h('span', {
              class: ['nk-select__checkbox', { 'nk-select__checkbox--checked': selected }],
            }),
          )
        }
        children.push(h('span', { class: 'nk-select__option-label' }, option.label))
        return h(
          'button',
          {
            key: option.value,
            class: [
              'nk-select__option',
              {
                'nk-select__option--selected': selected,
                'nk-select__option--active': index === activeIndex.value,
              },
            ],
            disabled: option.disabled,
            role: 'option',
            type: 'button',
            'aria-selected': selected,
            onClick: () => select(option),
          },
          children,
        )
      })
    }

    return () =>
      h('span', { class: ['nk-select', { 'nk-select--disabled': props.disabled }] }, [
        slots.prefix?.(),
        h(
          'button',
          {
            ref: triggerRef,
            class: [
              'nk-select__control',
              {
                'nk-select__control--placeholder': !displayText.value,
                'nk-select__control--multiple': props.multiple,
              },
            ],
            disabled: props.disabled,
            type: 'button',
            'aria-expanded': visible.value,
            'aria-haspopup': 'listbox',
            onClick: toggle,
            onKeydown: handleKey,
          },
          [renderTriggerContent()],
        ),
        props.clearable &&
          !props.disabled &&
          ((props.multiple &&
            Array.isArray(props.modelValue) &&
            props.modelValue.length > 0) ||
            (!props.multiple &&
              props.modelValue !== '' &&
              props.modelValue !== null &&
              props.modelValue !== undefined))
          ? h('button', { class: 'nk-select__clear', type: 'button', onClick: clear }, 'x')
          : null,
        visible.value &&
          h(
            'div',
            {
              ref: menuRef,
              class: 'nk-select__menu',
              role: 'listbox',
            },
            renderOptions(),
          ),
      ])
  },
})

export const NkCheckbox = defineComponent({
  name: 'NkCheckbox',
  props: {
    modelValue: { type: Boolean, default: false },
    label: { type: String, default: '' },
    indeterminate: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit, slots }) {
    function update(event: Event) {
      const value = (event.target as HTMLInputElement).checked
      emit('update:modelValue', value)
      emit('change', value)
    }

    return () =>
      h('label', { class: ['nk-checkbox', { 'nk-checkbox--disabled': props.disabled }] }, [
        h('input', {
          checked: props.modelValue,
          disabled: props.disabled,
          type: 'checkbox',
          'aria-checked': props.indeterminate ? 'mixed' : props.modelValue,
          onChange: update,
        }),
        h('span', { class: ['nk-checkbox__box', { 'nk-checkbox__box--indeterminate': props.indeterminate }] }),
        h('span', { class: 'nk-checkbox__label' }, slots.default?.() ?? props.label),
      ])
  },
})

export const NkCheckboxGroup = defineComponent({
  name: 'NkCheckboxGroup',
  props: {
    modelValue: { type: Array as PropType<Array<string | number>>, default: () => [] },
    options: { type: Array as PropType<NkOption[]>, default: () => [] },
    disabled: { type: Boolean, default: false },
    direction: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit, slots }) {
    function isChecked(value: string | number) {
      return props.modelValue.some((item) => String(item) === String(value))
    }

    function toggle(option: NkOption, event: Event) {
      if (props.disabled || option.disabled) return
      const checked = (event.target as HTMLInputElement).checked
      const current = [...props.modelValue]
      const next = checked
        ? [...current, option.value]
        : current.filter((item) => String(item) !== String(option.value))

      emit('update:modelValue', next)
      emit('change', next)
    }

    return () =>
      h(
        'div',
        {
          class: [
            'nk-checkbox-group',
            `nk-checkbox-group--${props.direction}`,
            { 'nk-checkbox-group--disabled': props.disabled },
          ],
          role: 'group',
        },
        props.options.map((option) =>
          h(
            'label',
            {
              key: option.value,
              class: ['nk-checkbox', { 'nk-checkbox--disabled': props.disabled || option.disabled }],
            },
            [
              h('input', {
                checked: isChecked(option.value),
                disabled: props.disabled || option.disabled,
                type: 'checkbox',
                onChange: (event: Event) => toggle(option, event),
              }),
              h('span', { class: 'nk-checkbox__box' }),
              h(
                'span',
                { class: 'nk-checkbox__label' },
                slots.option?.({ option, checked: isChecked(option.value) }) ?? option.label,
              ),
            ],
          ),
        ),
      )
  },
})

export const NkRadio = defineComponent({
  name: 'NkRadio',
  props: {
    modelValue: { type: [String, Number, Boolean], default: '' },
    options: { type: Array as PropType<NkOption[]>, default: () => [] },
    button: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    function choose(value: string | number) {
      if (props.disabled) return
      emit('update:modelValue', value)
      emit('change', value)
    }

    return () =>
      h(
        'div',
        { class: ['nk-radio-group', { 'nk-radio-group--button': props.button, 'nk-radio-group--disabled': props.disabled }] },
        props.options.map((option) =>
          h('label', { key: option.value, class: 'nk-radio' }, [
            h('input', {
              checked: props.modelValue === option.value,
              disabled: props.disabled || option.disabled,
              name: 'nk-radio',
              type: 'radio',
              onChange: () => choose(option.value),
            }),
            h('span', option.label),
          ]),
        ),
      )
  },
})

export const NkSlider = defineComponent({
  name: 'NkSlider',
  props: {
    modelValue: { type: Number, default: 0 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    step: { type: Number, default: 1 },
    marks: { type: [Array, Object] as PropType<NkOption[] | Record<string, string>>, default: () => [] },
    disabled: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const percent = computed(() => ((props.modelValue - props.min) / (props.max - props.min || 1)) * 100)
    const markList = computed(() =>
      Array.isArray(props.marks)
        ? props.marks
        : Object.entries(props.marks).map(([value, label]) => ({ value, label })),
    )

    function update(event: Event, isChange = false) {
      const value = Number((event.target as HTMLInputElement).value)
      emit('update:modelValue', value)
      if (isChange) emit('change', value)
    }

    return () =>
      h('div', { class: ['nk-slider', { 'nk-slider--disabled': props.disabled }] }, [
        h('div', { class: 'nk-slider__meta' }, [
          h('span', `${props.min}`),
          h('strong', `${props.modelValue}`),
          h('span', `${props.max}`),
        ]),
        h('input', {
          class: 'nk-slider__control',
          disabled: props.disabled,
          max: props.max,
          min: props.min,
          step: props.step,
          style: { '--nk-slider-percent': `${percent.value}%` },
          type: 'range',
          value: props.modelValue,
          onInput: (event: Event) => update(event),
          onChange: (event: Event) => update(event, true),
        }),
        markList.value.length > 0 &&
          h(
            'div',
            { class: 'nk-slider__marks' },
            markList.value.map((mark) => h('span', { key: mark.value }, mark.label)),
          ),
      ])
  },
})

export const NkUpload = defineComponent({
  name: 'NkUpload',
  props: {
    action: { type: String, default: '' },
    accept: { type: String, default: '' },
    multiple: { type: Boolean, default: false },
    limit: { type: Number, default: 0 },
    disabled: { type: Boolean, default: false },
  },
  emits: ['change', 'remove', 'exceed'],
  setup(props, { emit, expose, slots }) {
    const inputRef = ref<HTMLInputElement>()
    const files = ref<NkUploadFile[]>([])

    function handleChange(event: Event) {
      const selected = Array.from((event.target as HTMLInputElement).files ?? []).map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      }))

      if (props.limit > 0 && selected.length + files.value.length > props.limit) {
        emit('exceed', selected)
        return
      }

      files.value = props.multiple ? [...files.value, ...selected] : selected.slice(0, 1)
      emit('change', files.value)
    }

    function remove(file: NkUploadFile) {
      files.value = files.value.filter((item) => item !== file)
      emit('remove', file)
    }

    function clearFiles() {
      files.value = []
      if (inputRef.value) inputRef.value.value = ''
    }

    expose({
      clearFiles,
      submit: () => inputRef.value?.click(),
    })

    return () =>
      h('div', { class: ['nk-upload', { 'nk-upload--disabled': props.disabled }] }, [
        h('input', {
          ref: inputRef,
          accept: props.accept,
          class: 'nk-upload__input',
          disabled: props.disabled,
          multiple: props.multiple,
          type: 'file',
          onChange: handleChange,
        }),
        h(
          'button',
          {
            class: 'nk-upload__trigger',
            disabled: props.disabled,
            type: 'button',
            onClick: () => inputRef.value?.click(),
          },
          slots.trigger?.() ?? 'Upload',
        ),
        slots.tip?.(),
        files.value.length > 0 &&
          h(
            'ul',
            { class: 'nk-upload__list' },
            files.value.map((file) =>
              h('li', { key: file.name }, [
                slots.file?.({ file }) ?? h('span', file.name),
                h('button', { type: 'button', onClick: () => remove(file) }, 'x'),
              ]),
            ),
          ),
      ])
  },
})

export const NkForm = defineComponent({
  name: 'NkForm',
  props: {
    model: { type: Object as PropType<Record<string, unknown>>, default: () => ({}) },
    rules: { type: Object as PropType<Record<string, unknown>>, default: () => ({}) },
    labelWidth: { type: String, default: '112px' },
    layout: { type: String as PropType<'vertical' | 'horizontal' | 'inline'>, default: 'vertical' },
    disabled: { type: Boolean, default: false },
  },
  emits: ['validate', 'submit', 'reset'],
  setup(props, { emit, expose, slots }) {
    function validate() {
      emit('validate', true)
      return true
    }

    expose({
      clearValidate: () => undefined,
      resetFields: () => emit('reset'),
      validate,
    })

    return () =>
      h(
        'form',
        {
          class: ['nk-form', `nk-form--${props.layout}`, { 'nk-form--disabled': props.disabled }],
          style: { '--nk-form-label-width': props.labelWidth },
          onReset: () => emit('reset'),
          onSubmit: (event: Event) => {
            event.preventDefault()
            if (validate()) emit('submit', props.model)
          },
        },
        slots.default?.(),
      )
  },
})

export const NkBadge = defineComponent({
  name: 'NkBadge',
  props: {
    value: { type: [String, Number], default: '' },
    max: { type: Number, default: 99 },
    dot: { type: Boolean, default: false },
    type: { type: String as PropType<'primary' | 'success' | 'warning' | 'danger' | 'info'>, default: 'primary' },
    offset: { type: Array as unknown as PropType<[number, number]>, default: () => [0, 0] },
  },
  setup(props, { slots }) {
    const displayValue = computed(() => {
      if (props.dot) return ''
      return typeof props.value === 'number' && props.value > props.max ? `${props.max}+` : String(props.value)
    })

    return () =>
      h('span', { class: 'nk-badge' }, [
        slots.default?.(),
        h(
          'sup',
          {
            class: ['nk-badge__value', `nk-badge__value--${props.type}`, { 'nk-badge__value--dot': props.dot }],
            style: { transform: `translate(${props.offset[0]}px, ${props.offset[1]}px)` },
          },
          displayValue.value,
        ),
      ])
  },
})

export const NkAvatar = defineComponent({
  name: 'NkAvatar',
  props: {
    src: { type: String, default: '' },
    size: { type: [String, Number], default: 'md' },
    shape: { type: String as PropType<'circle' | 'square'>, default: 'circle' },
    alt: { type: String, default: '' },
    fallback: { type: String, default: '' },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'span',
        {
          class: ['nk-avatar', `nk-avatar--${props.shape}`, typeof props.size === 'string' ? `nk-avatar--${props.size}` : ''],
          style: typeof props.size === 'number' ? { '--nk-avatar-size': `${props.size}px` } : undefined,
        },
        props.src
          ? h('img', { alt: props.alt, src: props.src })
          : h('span', slots.fallback?.() ?? (props.fallback || props.alt.slice(0, 2).toUpperCase())),
      )
  },
})

export const NkList = defineComponent({
  name: 'NkList',
  props: {
    dataSource: { type: Array as PropType<unknown[]>, default: () => [] },
    bordered: { type: Boolean, default: false },
    split: { type: Boolean, default: true },
    loading: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    return () =>
      h('div', { class: ['nk-list', { 'nk-list--bordered': props.bordered, 'nk-list--split': props.split }] }, [
        slots.header?.(),
        props.loading
          ? h('div', { class: 'nk-list__loading' }, 'Loading...')
          : h(
              'ul',
              { class: 'nk-list__items' },
              props.dataSource.map((item, index) =>
                h('li', { key: index, class: 'nk-list__item' }, slots.item?.({ item, index }) ?? String(item)),
              ),
            ),
        slots.footer?.(),
      ])
  },
})

export const NkTree = defineComponent({
  name: 'NkTree',
  props: {
    data: { type: Array as PropType<NkItem[]>, default: () => [] },
    checkedKeys: { type: Array as PropType<Array<string | number>>, default: () => [] },
    expandedKeys: { type: Array as PropType<Array<string | number>>, default: () => [] },
    checkable: { type: Boolean, default: false },
    draggable: { type: Boolean, default: false },
  },
  emits: ['check', 'expand', 'select'],
  setup(props, { emit, slots }) {
    const selectedKey = ref<string>('')

    function renderNodes(nodes: NkItem[], level = 0): VNode {
      const checked = props.checkedKeys.map(String)
      const expanded = props.expandedKeys.map(String)

      return h(
        'ul',
        { class: 'nk-tree__nodes' },
        nodes.map((node, index) => {
          const key = itemKey(node, index)
          const hasChildren = Boolean(node.children?.length)
          const isExpanded = expanded.includes(key) || level === 0
          const isSelected = selectedKey.value === key

          return h('li', { key, class: 'nk-tree__node', draggable: props.draggable || undefined }, [
            h('div', {
              class: ['nk-tree__row', isSelected && 'nk-tree__row--selected'],
              style: { '--nk-tree-level': level },
            }, [
              hasChildren &&
                h(
                  'button',
                  {
                    class: ['nk-tree__toggle', isExpanded && 'nk-tree__toggle--expanded'],
                    type: 'button',
                    onClick: () => emit('expand', key),
                  },
                  isExpanded ? '-' : '+',
                ),
              props.checkable &&
                h('label', { class: 'nk-checkbox nk-tree__checkbox' }, [
                  h('input', {
                    checked: checked.includes(key),
                    type: 'checkbox',
                    onChange: (event: Event) => emit('check', key, (event.target as HTMLInputElement).checked),
                  }),
                  h('span', { class: 'nk-checkbox__box' }),
                ]),
              h(
                'button',
                {
                  class: 'nk-tree__label',
                  type: 'button',
                  onClick: () => {
                    selectedKey.value = key
                    emit('select', key)
                  },
                },
                slots.title?.({ node }) ?? itemLabel(node),
              ),
            ]),
            hasChildren && isExpanded && renderNodes(node.children ?? [], level + 1),
          ])
        }),
      )
    }

    return () => h('div', { class: 'nk-tree' }, renderNodes(props.data))
  },
})

export const NkEmpty = defineComponent({
  name: 'NkEmpty',
  props: {
    description: { type: String, default: 'No data' },
    image: { type: String, default: '' },
    imageSize: { type: [Number, String], default: 72 },
  },
  setup(props, { slots }) {
    return () =>
      h('div', { class: 'nk-empty' }, [
        h(
          'div',
          {
            class: 'nk-empty__image',
            style: { '--nk-empty-image-size': typeof props.imageSize === 'number' ? `${props.imageSize}px` : props.imageSize },
          },
          slots.image?.() ?? (props.image ? h('img', { alt: '', src: props.image }) : 'No'),
        ),
        h('p', { class: 'nk-empty__description' }, props.description),
        slots.default?.(),
      ])
  },
})

export const NkTabs = defineComponent({
  name: 'NkTabs',
  props: {
    modelValue: { type: [String, Number], default: '' },
    items: { type: Array as PropType<NkItem[]>, default: () => [] },
    type: { type: String as PropType<'line' | 'card'>, default: 'line' },
    closable: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'change', 'close'],
  setup(props, { emit, slots }) {
    const active = computed(() => props.modelValue || itemKey(props.items[0] ?? {}, 0))

    function activate(key: string) {
      emit('update:modelValue', key)
      emit('change', key)
    }

    return () =>
      h('div', { class: ['nk-tabs', `nk-tabs--${props.type}`] }, [
        h(
          'div',
          { class: 'nk-tabs__nav', role: 'tablist' },
          props.items.map((item, index) => {
            const key = itemKey(item, index)
            return h(
              'button',
              {
                key,
                class: ['nk-tabs__tab', { 'nk-tabs__tab--active': active.value === key }],
                disabled: item.disabled,
                role: 'tab',
                type: 'button',
                onClick: () => activate(key),
              },
              [
                slots.tab?.({ item }) ?? itemLabel(item),
                props.closable &&
                  h('span', { class: 'nk-tabs__close', onClick: (event: MouseEvent) => { event.stopPropagation(); emit('close', key) } }, 'x'),
              ],
            )
          }),
        ),
        h(
          'div',
          { class: 'nk-tabs__panel', role: 'tabpanel' },
          slots.panel?.({ active: active.value }) ??
            props.items.find((item, index) => itemKey(item, index) === active.value)?.content ??
            slots.default?.(),
        ),
      ])
  },
})

export const NkBreadcrumb = defineComponent({
  name: 'NkBreadcrumb',
  props: {
    items: { type: Array as PropType<NkItem[]>, default: () => [] },
    separator: { type: String, default: '/' },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'nav',
        { class: 'nk-breadcrumb', 'aria-label': 'Breadcrumb' },
        props.items.map((item, index) =>
          h('span', { key: itemKey(item, index), class: 'nk-breadcrumb__item' }, [
            slots.item?.({ item, index }) ?? itemLabel(item),
            index < props.items.length - 1 && h('span', { class: 'nk-breadcrumb__separator' }, props.separator),
          ]),
        ),
      )
  },
})

export const NkDropdown = defineComponent({
  name: 'NkDropdown',
  props: {
    options: { type: Array as PropType<NkOption[]>, default: () => [] },
    trigger: { type: String as PropType<'hover' | 'click'>, default: 'hover' },
    placement: { type: String, default: 'bottom' },
    disabled: { type: Boolean, default: false },
  },
  emits: ['select', 'visibleChange'],
  setup(props, { emit, slots }) {
    const visible = ref(false)

    function setVisible(value: boolean) {
      if (props.disabled) return
      visible.value = value
      emit('visibleChange', value)
    }

    function select(option: NkOption) {
      emit('select', option.value)
      setVisible(false)
    }

    return () =>
      h(
        'div',
        {
          class: ['nk-dropdown', `nk-dropdown--${props.placement}`],
          onMouseenter: () => props.trigger === 'hover' && setVisible(true),
          onMouseleave: () => props.trigger === 'hover' && setVisible(false),
        },
        [
          h(
            'button',
            {
              class: 'nk-dropdown__trigger',
              disabled: props.disabled,
              type: 'button',
              onClick: () => props.trigger === 'click' && setVisible(!visible.value),
            },
            slots.default?.() ?? 'Actions',
          ),
          visible.value &&
            h(
              'div',
              { class: 'nk-dropdown__menu' },
              slots.overlay?.() ??
                props.options.map((option) =>
                  h(
                    'button',
                    { key: option.value, disabled: option.disabled, type: 'button', onClick: () => select(option) },
                    option.label,
                  ),
                ),
            ),
        ],
      )
  },
})

export const NkMenu = defineComponent({
  name: 'NkMenu',
  props: {
    modelValue: { type: [String, Number], default: '' },
    items: { type: Array as PropType<NkItem[]>, default: () => [] },
    mode: { type: String as PropType<'vertical' | 'horizontal'>, default: 'vertical' },
    collapsed: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'select'],
  setup(props, { emit, slots }) {
    function choose(key: string) {
      emit('update:modelValue', key)
      emit('select', key)
    }

    return () =>
      h(
        'nav',
        { class: ['nk-menu', `nk-menu--${props.mode}`, { 'nk-menu--collapsed': props.collapsed }] },
        props.items.map((item, index) => {
          const key = itemKey(item, index)
          return h(
            'button',
            {
              key,
              class: ['nk-menu__item', { 'nk-menu__item--active': props.modelValue === key }],
              disabled: item.disabled,
              type: 'button',
              onClick: () => choose(key),
            },
            [slots.icon?.({ item }), h('span', itemLabel(item))],
          )
        }),
      )
  },
})

export const NkSteps = defineComponent({
  name: 'NkSteps',
  props: {
    current: { type: Number, default: 0 },
    items: { type: Array as PropType<NkItem[]>, default: () => [] },
    direction: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
    status: { type: String as PropType<'wait' | 'process' | 'finish' | 'error'>, default: 'process' },
  },
  emits: ['change'],
  setup(props, { emit, slots }) {
    return () =>
      h(
        'ol',
        { class: ['nk-steps', `nk-steps--${props.direction}`] },
        props.items.map((item, index) =>
          h(
            'li',
            {
              key: itemKey(item, index),
              class: [
                'nk-step',
                index < props.current ? 'nk-step--finish' : index === props.current ? `nk-step--${props.status}` : 'nk-step--wait',
              ],
              onClick: () => emit('change', index),
            },
            [
              h('span', { class: 'nk-step__index' }, slots.icon?.({ item, index }) ?? index + 1),
              h('span', { class: 'nk-step__body' }, [
                h('strong', itemLabel(item)),
                h('small', slots.description?.({ item }) ?? item.content),
              ]),
            ],
          ),
        ),
      )
  },
})

export const NkAlert = defineComponent({
  name: 'NkAlert',
  props: {
    type: { type: String as PropType<'success' | 'info' | 'warning' | 'error'>, default: 'info' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    closable: { type: Boolean, default: false },
    showIcon: { type: Boolean, default: false },
  },
  emits: ['close'],
  setup(props, { emit, slots }) {
    const visible = ref(true)

    function close() {
      visible.value = false
      emit('close')
    }

    return () =>
      visible.value &&
      h('div', { class: ['nk-alert', `nk-alert--${props.type}`], role: 'alert' }, [
        props.showIcon && h('span', { class: 'nk-alert__icon' }, props.type.slice(0, 1).toUpperCase()),
        h('span', { class: 'nk-alert__body' }, [
          h('strong', slots.title?.() ?? props.title),
          (props.description || slots.description) && h('span', slots.description?.() ?? props.description),
        ]),
        props.closable && h('button', { type: 'button', onClick: close }, 'x'),
      ])
  },
})

export const NkDialog = defineComponent({
  name: 'NkDialog',
  props: {
    open: { type: Boolean, default: false },
    title: { type: String, default: '' },
    width: { type: String, default: '520px' },
    closeOnOverlay: { type: Boolean, default: true },
    footer: { type: Boolean, default: true },
  },
  emits: ['update:open', 'confirm', 'cancel'],
  setup(props, { emit, expose, slots }) {
    const DIALOG_DURATION = 280
    const visible = ref(false)
    const entering = ref(false)
    const leaving = ref(false)
    let leaveTimer: ReturnType<typeof setTimeout> | null = null

    watch(() => props.open, (val) => {
      if (val) {
        if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null }
        leaving.value = false
        visible.value = true
        nextTick(() => {
          requestAnimationFrame(() => {
            entering.value = true
          })
        })
      } else if (visible.value) {
        entering.value = false
        leaving.value = true
        leaveTimer = setTimeout(() => {
          visible.value = false
          leaving.value = false
          leaveTimer = null
        }, DIALOG_DURATION)
      }
    })

    function close() {
      emit('update:open', false)
      emit('cancel')
    }

    function open() {
      emit('update:open', true)
    }

    expose({ close, open })

    return () =>
      visible.value &&
      h(Teleport, { to: 'body' },
        h('div', { class: 'nk-dialog', role: 'dialog', 'aria-modal': 'true' }, [
          h('div', {
            class: ['nk-dialog__overlay', entering.value && 'nk-dialog__overlay--entering', leaving.value && 'nk-dialog__overlay--leaving'],
            onClick: () => props.closeOnOverlay && close(),
          }),
          h('section', {
            class: ['nk-dialog__panel', entering.value && 'nk-dialog__panel--entering', leaving.value && 'nk-dialog__panel--leaving'],
            style: { width: props.width },
          }, [
            h('header', { class: 'nk-dialog__header' }, [
              h('h3', props.title),
              h('button', { type: 'button', onClick: close }, 'x'),
            ]),
            h('div', { class: 'nk-dialog__body' }, slots.default?.()),
            props.footer &&
              h('footer', { class: 'nk-dialog__footer' }, [
                slots.footer?.() ?? [
                  h('button', { class: 'nk-overlay-button', type: 'button', onClick: close }, 'Cancel'),
                  h('button', { class: 'nk-overlay-button nk-overlay-button--primary', type: 'button', onClick: () => emit('confirm') }, 'Confirm'),
                ],
              ]),
          ]),
        ])
      )
  },
})

export const NkDrawer = defineComponent({
  name: 'NkDrawer',
  props: {
    open: { type: Boolean, default: false },
    title: { type: String, default: '' },
    placement: { type: String as PropType<'left' | 'right' | 'top' | 'bottom'>, default: 'right' },
    size: { type: String, default: '360px' },
  },
  emits: ['update:open', 'close'],
  setup(props, { emit, expose, slots }) {
    const DRAWER_DURATION = 320
    const visible = ref(false)
    const entering = ref(false)
    const leaving = ref(false)
    let leaveTimer: ReturnType<typeof setTimeout> | null = null

    watch(() => props.open, (val) => {
      if (val) {
        if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null }
        leaving.value = false
        visible.value = true
        nextTick(() => {
          requestAnimationFrame(() => {
            entering.value = true
          })
        })
      } else if (visible.value) {
        entering.value = false
        leaving.value = true
        leaveTimer = setTimeout(() => {
          visible.value = false
          leaving.value = false
          leaveTimer = null
        }, DRAWER_DURATION)
      }
    })

    function close() {
      emit('update:open', false)
      emit('close')
    }

    function open() {
      emit('update:open', true)
    }

    expose({ close, open })

    return () =>
      visible.value &&
      h(Teleport, { to: 'body' },
        h('div', { class: ['nk-drawer', `nk-drawer--${props.placement}`] }, [
          h('div', {
            class: ['nk-drawer__overlay', entering.value && 'nk-drawer__overlay--entering', leaving.value && 'nk-drawer__overlay--leaving'],
            onClick: close,
          }),
          h('aside', {
            class: ['nk-drawer__panel', entering.value && 'nk-drawer__panel--entering', leaving.value && 'nk-drawer__panel--leaving'],
            style: { '--nk-drawer-size': props.size },
          }, [
            h('header', { class: 'nk-drawer__header' }, [
              h('h3', props.title),
              h('button', { type: 'button', onClick: close }, 'x'),
            ]),
            h('div', { class: 'nk-drawer__body' }, slots.default?.()),
            slots.footer && h('footer', { class: 'nk-drawer__footer' }, slots.footer()),
          ]),
        ])
      )
  },
})

function pushMessage(type: string, content: string, duration = 2600) {
  if (typeof document === 'undefined') return

  const hostId = 'nk-message-host'
  let host = document.getElementById(hostId)
  if (!host) {
    host = document.createElement('div')
    host.id = hostId
    host.className = 'nk-message-host'
    document.body.appendChild(host)
  }

  const node = document.createElement('div')
  node.className = `nk-message nk-message--${type}`
  node.textContent = content
  host.appendChild(node)
  window.setTimeout(() => {
    node.remove()
  }, duration)
}

const NkMessageComponent = defineComponent({
  name: 'NkMessage',
  props: {
    type: { type: String as PropType<'success' | 'info' | 'warning' | 'error'>, default: 'info' },
    content: { type: String, default: '' },
    duration: { type: Number, default: 2600 },
    closable: { type: Boolean, default: false },
  },
  emits: ['close'],
  setup(props, { emit, slots }) {
    const visible = ref(true)
    return () =>
      visible.value &&
      h('div', { class: ['nk-message', `nk-message--${props.type}`] }, [
        h('span', slots.default?.() ?? props.content),
        props.closable &&
          h('button', { type: 'button', onClick: () => { visible.value = false; emit('close') } }, 'x'),
      ])
  },
})

export const NkMessage = Object.assign(NkMessageComponent, {
  error: (content: string, duration?: number) => pushMessage('error', content, duration),
  info: (content: string, duration?: number) => pushMessage('info', content, duration),
  success: (content: string, duration?: number) => pushMessage('success', content, duration),
  warning: (content: string, duration?: number) => pushMessage('warning', content, duration),
})

export const NkTooltip = defineComponent({
  name: 'NkTooltip',
  props: {
    content: { type: String, default: '' },
    placement: { type: String as PropType<'top' | 'right' | 'bottom' | 'left'>, default: 'top' },
    trigger: { type: String as PropType<'hover' | 'click'>, default: 'hover' },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    const visible = ref(false)

    function setVisible(value: boolean) {
      if (!props.disabled) visible.value = value
    }

    return () =>
      h(
        'span',
        {
          class: ['nk-tooltip', `nk-tooltip--${props.placement}`],
          onBlur: () => setVisible(false),
          onClick: () => props.trigger === 'click' && setVisible(!visible.value),
          onFocus: () => props.trigger === 'hover' && setVisible(true),
          onMouseenter: () => props.trigger === 'hover' && setVisible(true),
          onMouseleave: () => props.trigger === 'hover' && setVisible(false),
        },
        [
          h('span', { class: 'nk-tooltip__target' }, slots.default?.()),
          visible.value && h('span', { class: 'nk-tooltip__bubble' }, slots.content?.() ?? props.content),
        ],
      )
  },
})

export const NkSkeleton = defineComponent({
  name: 'NkSkeleton',
  props: {
    loading: { type: Boolean, default: true },
    rows: { type: Number, default: 3 },
    animated: { type: Boolean, default: false },
    avatar: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    return () =>
      props.loading
        ? h('div', { class: ['nk-skeleton', { 'nk-skeleton--animated': props.animated }] }, [
            props.avatar && h('span', { class: 'nk-skeleton__avatar' }),
            h(
              'span',
              { class: 'nk-skeleton__content' },
              Array.from({ length: props.rows }).map((_, index) =>
                h('i', { key: index, style: { width: `${96 - index * 14}%` } }),
              ),
            ),
          ])
        : slots.default?.()
  },
})
