const menuItems = {
  items: [
    {
      type: 'group',
      children: [
        {
          id: 'Home',
          title: 'Home',
          type: 'item',
          icon: 'feather icon-home',
          url: '/'
        },
        {
          id: 'Products',
          title: 'Produktet',
          type: 'item',
          icon: 'feather icon-package',
          url: '/produktet'
        },
        {
          id: 'AboutUs',
          title: 'Rreth Nesh',
          type: 'item',
          icon: 'feather icon-info',
          url: '/'
        },
        {
          id: 'ContactUs',
          title: 'Na Kontaktoni',
          type: 'item',
          icon: 'feather icon-at-sign',
          url: '/ContactUs'
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
          id: 'Produktet',
          title: 'Produktet',
          type: 'collapse',
          icon: 'feather icon-home',
          children: [
            {
              id: 'ListaEProdukteve',
              title: 'Lista e Produkteve',
              type: 'item',
              url: '/admin/produktet/ListaEProdukteve'
            },
            {
              id: 'Kategorite',
              title: 'Kategorite',
              type: 'item',
              url: '/admin/produktet/kategorite'
            },
            {
              id: 'Kompanite',
              title: 'Kompanite',
              type: 'item',
              url: '/admin/produktet/kompanite'
            }
          ]
        },
        {
          id: 'TeNdryshme',
          title: 'Te Ndryshme',
          type: 'collapse',
          icon: 'feather icon-sliders',
          children: [
            {
              id: 'OfertatSliderHome',
              title: 'Ofertat Slider Home',
              type: 'item',
              url: '/admin/ofertatslider'
            },
            
          ]
        },
        {
          id: 'Porosit',
          title: 'Porosit',
          type: 'item',
          icon: 'feather icon-package',
          url: '/'
        },
        {
          id: 'Klientet',
          title: 'Klientet',
          type: 'item',
          icon: 'feather icon-info',
          url: '/admin/klientet'
        },
        {
          id: 'Mesazhet',
          title: 'Mesazhet',
          type: 'item',
          icon: 'feather icon-at-sign',
          url: '/admin/mesazhet'
        }
      ]
    }
  ]
};

export default menuItems;