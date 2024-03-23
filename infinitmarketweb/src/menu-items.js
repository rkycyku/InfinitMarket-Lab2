const menuItems = {
  items: [
    {
      type: 'group',
      children: [
        {
          id: 'forms',
          title: 'Home',
          type: 'item',
          icon: 'feather icon-home',
          url: '/'
        },
        {
          id: 'forms',
          title: 'Products',
          type: 'item',
          icon: 'feather icon-package',
          url: '/'
        },
        {
          id: 'forms',
          title: 'About Us',
          type: 'item',
          icon: 'feather icon-info',
          url: '/'
        },
        {
          id: 'forms',
          title: 'Contact Us',
          type: 'item',
          icon: 'feather icon-at-sign',
          url: '/'
        }
      ]
    },
    {
      id: 'admindashboard',
      title: 'Admin Dashboard',
      type: 'group admin',
      icon: 'icon-navigation',
      children: [
        {
          id: 'forms',
          title: 'Produktet',
          type: 'collapse',
          icon: 'feather icon-home',
          children: [
            {
              id: 'button',
              title: 'Lista e Produkteve',
              type: 'item',
              url: '/basic/button'
            },
            {
              id: 'badges',
              title: 'Kategorite',
              type: 'item',
              url: '/admin/produktet/kategorite'
            },
            {
              id: 'breadcrumb',
              title: 'Kompanite',
              type: 'item',
              url: '/basic/breadcrumb'
            }
          ]
        },
        {
          id: 'forms',
          title: 'Porosit',
          type: 'item',
          icon: 'feather icon-package',
          url: '/'
        },
        {
          id: 'forms',
          title: 'Klientet',
          type: 'item',
          icon: 'feather icon-info',
          url: '/'
        },
        {
          id: 'forms',
          title: 'Mesazhet',
          type: 'item',
          icon: 'feather icon-at-sign',
          url: '/'
        }
      ]
    }
  ]
};

export default menuItems;
