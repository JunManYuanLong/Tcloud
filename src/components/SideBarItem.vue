<script>
export default {
  name: 'SideBarItem',
  data () {
    return {}
  },
  props: {
    sidebar: {
      type: Object,
      required: true
    }
  },
  render (h) {
    if (this.sidebar.dropdown) {
      return this.renderSubmenu(h, this.sidebar)
    } else {
      return this.renderMenuItem(h, this.sidebar)
    }
  },
  methods: {
    renderMenuItem (h, sidebar) {
      return h(
        'el-menu-item',
        {props: {index: sidebar.index, route: sidebar.route}},
        [
          h('i', {'class': sidebar.icon}),
          sidebar.text
        ]
      )
    },
    renderSubmenu (h, sidebar) {
      if (!sidebar.children) {
        sidebar.children = []
      }
      return h(
        'el-submenu',
        {props: {index: sidebar.index, route: sidebar.route}},
        [
          h('template', {slot: 'title'}, [h('i', {'class': sidebar.icon}), sidebar.text]),
          sidebar.children.map(item => {
            return h('side-bar-item', {props: {sidebar: item}})
          })
        ]
      )
    }
  }
}
</script>
