# Monica Lugo Alisamentos

Landing page responsiva e acessível para apresentar os serviços de Monica Lugo em Viamão.

## Tecnologias

- HTML semântico
- CSS moderno e responsivo
- JavaScript puro
- Sem backend
- Sem dependências obrigatórias

## Como visualizar

Abra o arquivo `index.html` no navegador.

Para uma experiência melhor durante o desenvolvimento, use uma extensão como **Live Server** no VS Code.

## Onde editar as informações

Abra o arquivo `data.js`.

```js
const siteData = {
  links: {
    instagram: "https://www.instagram.com/monicalugoliso",
    whatsappNumber: "",
    googleMaps: ""
  }
};
```

### WhatsApp

Preencha o número com código do país e DDD, somente números.

Exemplo fictício:

```js
whatsappNumber: "5551999999999"
```

### Google Maps

Cole o link completo do local em:

```js
googleMaps: "LINK_AQUI"
```

### Serviços

Os serviços ficam no array `services` do arquivo `data.js`. É possível adicionar, remover ou trocar os textos sem mexer no HTML.

## Como adicionar fotos depois

Coloque as imagens escolhidas dentro de:

```text
assets/images/
```

Sugestão de nomes:

```text
perfil.webp
capa.webp
trabalhando.webp
antes-01.webp
depois-01.webp
```

O formato recomendado é **WebP**, por ser leve para sites.

## Próximos passos

1. Escolher a foto principal.
2. Confirmar o número do WhatsApp.
3. Confirmar o link do Google Maps.
4. Selecionar os pares corretos de antes e depois.
5. Adicionar fotos de trabalho e palestras.
6. Revisar textos finais com a Monica.
