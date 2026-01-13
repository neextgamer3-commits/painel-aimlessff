# Painel AimlessFF - App com Sobreposição Android

## Funcionalidades

- **Painel de controle** estilo gaming com tema vermelho/preto
- **Botão flutuante** que pode sobrepor outros apps (Android)
- **6 seções** de configurações: Principal, Configs, Gelo, I.A, Otimizar, Mais
- **Checkboxes e Toggles** para ativar/desativar recursos

## Estrutura do Módulo Nativo (Android Overlay)

```
modules/floating-bubble/
├── android/
│   ├── build.gradle
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── java/expo/modules/floatingbubble/
│       │   └── FloatingBubbleModule.kt
│       └── res/drawable/
│           └── bubble_icon.xml
├── src/
│   ├── index.ts
│   └── FloatingBubble.types.ts
├── expo-module.config.json
└── package.json
```

## Como Habilitar a Sobreposição Real

### Pré-requisitos
- Node.js 18+
- Android Studio instalado
- Dispositivo Android conectado ou emulador

### Passo 1: Instalar EAS CLI
```bash
npm install -g eas-cli
```

### Passo 2: Criar Development Build (Local)
```bash
cd frontend

# Gerar os arquivos nativos Android
npx expo prebuild --platform android

# Compilar e instalar no dispositivo
npx expo run:android
```

### Passo 3: Criar Development Build (Cloud - EAS)
```bash
# Login no Expo
eas login

# Configurar o projeto
eas build:configure

# Criar APK de desenvolvimento
eas build --profile development --platform android
```

### Passo 4: Conceder Permissão de Overlay
Após instalar o APK no dispositivo:

1. Abra o app
2. Toque em "Ativar Sobreposição"
3. Será redirecionado para as configurações
4. Encontre "Painel AimlessFF" na lista
5. Ative "Permitir exibição sobre outros apps"
6. Volte ao app

## Permissões Necessárias (Android)

```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
```

## API do Módulo FloatingBubble

### Funções

```typescript
import { 
  hasOverlayPermission,
  requestOverlayPermission,
  showBubble,
  hideBubble,
  updatePosition,
  isVisible
} from '../modules/floating-bubble/src';

// Verificar se tem permissão
const hasPermission = hasOverlayPermission();

// Solicitar permissão (abre configurações)
requestOverlayPermission();

// Mostrar bolha na posição (x, y)
await showBubble(50, 200);

// Esconder bolha
hideBubble();

// Atualizar posição
updatePosition(100, 300);

// Verificar se está visível
const visible = isVisible();
```

### Eventos

```typescript
import { 
  addBubblePressListener,
  addBubbleDragListener,
  addBubbleRemoveListener
} from '../modules/floating-bubble/src';

// Quando usuário toca na bolha
const subscription = addBubblePressListener((event) => {
  console.log('Bolha pressionada em:', event.x, event.y);
});

// Quando usuário arrasta a bolha
addBubbleDragListener((event) => {
  console.log('Bolha movida para:', event.x, event.y);
});

// Quando bolha é removida
addBubbleRemoveListener((event) => {
  console.log('Bolha removida');
});

// Limpar listener
subscription.remove();
```

## Limitações

- **iOS**: Não suportado - Apple não permite sobreposição de apps
- **Expo Go**: Módulo nativo não funciona - apenas Development Build
- **Android < 6.0**: Permissão concedida automaticamente
- **Android >= 6.0**: Requer permissão manual do usuário

## Personalização da Bolha

Para customizar o ícone da bolha, edite:
`modules/floating-bubble/android/src/main/res/drawable/bubble_icon.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="48dp"
    android:height="48dp"
    android:viewportWidth="48"
    android:viewportHeight="48">
    <!-- Círculo vermelho de fundo -->
    <path
        android:fillColor="#FF0040"
        android:pathData="M24,4C12.95,4 4,12.95 4,24s8.95,20 20,20 20,-8.95 20,-20S35.05,4 24,4z"/>
    <!-- Mira branca -->
    <path
        android:fillColor="#FFFFFF"
        android:pathData="M24,14c-5.52,0 -10,4.48 -10,10s4.48,10 10,10 10,-4.48 10,-10 -4.48,-10 -10,-10z"/>
</vector>
```

## Testando

### No Expo Go (Simulação)
O app funciona normalmente, mas o botão de sobreposição mostra um aviso explicando que é necessário um Development Build.

### Em Development Build
1. Compile o APK
2. Instale no dispositivo
3. Conceda permissão de overlay
4. Toque em "Ativar Sobreposição"
5. Minimize o app - a bolha aparecerá sobre outros apps
6. Toque na bolha para reabrir o painel
