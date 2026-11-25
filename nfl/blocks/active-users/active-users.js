export default function decorate(block) {
  const link = block.querySelector('a[href]');
  const heading = block.querySelector('h2, h3');
  const value = document.createElement('output');
  value.className = 'active-users-value';
  value.setAttribute('aria-live', 'polite');
  value.setAttribute('aria-label', 'Longitud del texto de prueba');
  value.textContent = 'Cargando...';
  const status = document.createElement('p');
  status.className = 'active-users-status';
  status.textContent = 'Dato simulado de JSONPlaceholder, no son usuarios reales.';
  const pause = document.createElement('button');
  pause.type = 'button';
  pause.textContent = 'Pausar actualización';
  pause.setAttribute('aria-pressed', 'false');
  block.replaceChildren(...(heading ? [heading] : []), value, status, pause);

  let endpoint;
  try {
    endpoint = new URL(link?.href);
    if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password) {
      throw new Error('The counter requires a public HTTPS endpoint');
    }
  } catch (error) {
    value.textContent = 'No disponible';
    status.textContent = 'Configura un enlace HTTPS válido al servicio de prueba.';
    pause.hidden = true;
    // eslint-disable-next-line no-console
    console.error('Invalid active-users block configuration', error);
    return;
  }

  let paused = false;
  let pending = false;
  let timer;
  async function poll() {
    if (!block.isConnected) {
      window.clearInterval(timer);
      return;
    }
    if (pending || paused || document.hidden) return;
    pending = true;
    try {
      const response = await fetch(endpoint.href, {
        credentials: 'omit',
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) throw new Error(`Counter returned HTTP ${response.status}`);
      const data = await response.json();
      if (!Number.isSafeInteger(data.value) || data.value < 0) {
        throw new Error('Counter response must contain a nonnegative integer value');
      }
      if (!paused) {
        value.textContent = String(data.value);
        status.textContent = 'Dato simulado. Consulta cada 5 s; caché de 10 s.';
      }
    } catch (error) {
      if (!paused) {
        value.textContent = 'No disponible';
        status.textContent = 'No se pudo actualizar el dato de prueba. Se reintentará.';
      }
      // eslint-disable-next-line no-console
      console.error('Active-users counter request failed', error);
    } finally {
      pending = false;
    }
  }

  pause.addEventListener('click', () => {
    paused = !paused;
    pause.textContent = paused ? 'Reanudar actualización' : 'Pausar actualización';
    pause.setAttribute('aria-pressed', String(paused));
    if (!paused) poll();
  });
  timer = window.setInterval(poll, 5000);
  poll();
}
