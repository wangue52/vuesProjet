<script setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue';
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue';
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue';
</script>

<template>
  <!-- 👉 Dashboards -->
  <VerticalNavGroup
    :item="{
      title: 'Dashboards',
      badgeClass: 'bg-error',
      icon: 'ri-home-smile-line',
    }"
  >
    <VerticalNavLink
      :item="{
        title: 'acceuil',
        to: '/dashboard',
        badgeClass: 'bg',

      }"
    />
    <VerticalNavLink
      :item="{
        title: 'ajouter un utilisateur',
        to: '/ajouter-user',
      }"
   />
   <VerticalNavLink
      :item="{
        title: 'liste des utilisateur',
        icon: 'ri-user-add-line',
        to: '/liste-utilisateur',
      }"
   />
   <VerticalNavLink
      :item="{
        title: 'localisation',
        icon: 'ri-search-2-line',
        to: '/store-localisation',
      }"
   />
  </VerticalNavGroup>

  <!-- 👉 Apps & Pages -->
  <VerticalNavGroup
    :item="{
     title: 'gestion des commerce',
    }"
  >
  <VerticalNavLink
    :item="{
     title: 'liste des boutiques',
        to: '/liste-boutique',
      badgeClass: 'bg-light-primary text-primary',
    }"
  />
  <VerticalNavLink
    :item="{
     title: 'gestion des blocs',
        to: '/bloc',
      badgeClass: 'bg-light-primary text-primary',
    }"
  />
</VerticalNavGroup>
  <VerticalNavLink
    :item="{
      title: 'Account Settings',
      icon: 'ri-user-settings-line',
      to: '/account-settings',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Login',
      icon: 'ri-login-box-line',
      to: '/login',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Error',
      icon: 'ri-information-line',
      to: '/no-existence',
    }"
  />

  <!-- 👉 User Interface -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'User Interface',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'nouvelle lettre',
      icon: 'ri-text',
      to: '/nouvelle-lettre',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'location',
      icon: 'ri-file-list-3-fill',
      to: '/location',
    }"
  />
  <!-- 👉 Others -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'autres',
    }"
  />

</template>
