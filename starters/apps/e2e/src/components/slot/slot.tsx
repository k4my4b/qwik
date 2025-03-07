import {
  component$,
  useStore,
  Slot,
  useContext,
  useSignal,
  useContextProvider,
  createContextId,
  type Signal,
  _jsxBranch,
  jsx,
  type JSXNode,
} from '@builder.io/qwik';

export const SlotParent = component$(() => {
  const state = useStore({
    disableButtons: false,
    disableNested: false,
    removeContent: false,
    render: true,
    count: 0,
  });
  return (
    <section class="todoapp">
      {state.render && (
        <>
          <Issue1630>
            <Child id="slot-child" q:slot="slot-content">
              Component Slot Content
            </Child>
            <p q:slot="slot-content" id="slot-p">
              P Slot Content
            </p>
            <p id="noslot-p">Non-Slotted Content</p>
          </Issue1630>
          <Issue1410>
            <span id="modal-content">Model content</span>
          </Issue1410>
          <Issue2688 count={state.count} />
          <Projector state={state} id="btn1">
            {!state.removeContent && <>DEFAULT {state.count}</>}
            <span q:slot="ignore">IGNORE</span>
          </Projector>

          <Projector state={state} id="btn2">
            {!state.removeContent && <div q:slot="start">START {state.count}</div>}
          </Projector>

          <Thing state={state} id="btn3">
            <Projector id="projected" state={state}>
              {!state.removeContent && <>INSIDE THING {state.count}</>}
            </Projector>
          </Thing>
          <Issue2751 />

          <Issue3565 model={Issue3565Model} />

          <Issue3607 />
          <Issue3727 />
        </>
      )}
      <div>
        <button
          id="btn-toggle-content"
          class="border border-cyan-600"
          onClick$={() => (state.removeContent = !state.removeContent)}
        >
          Toggle content
        </button>
      </div>
      <div>
        <button
          id="btn-toggle-buttons"
          class="border border-cyan-600"
          onClick$={() => (state.disableButtons = !state.disableButtons)}
        >
          Toggle buttons
        </button>
      </div>
      <div>
        <button
          id="btn-toggle-thing"
          class="border border-cyan-600"
          onClick$={() => (state.disableNested = !state.disableNested)}
        >
          Toogle Thing
        </button>
      </div>
      <div>
        <button id="btn-count" class="border border-cyan-600" onClick$={() => state.count++}>
          Count
        </button>
      </div>
      <div>
        <button
          id="btn-toggle-render"
          class="border border-cyan-600"
          onClick$={() => (state.render = !state.render)}
        >
          Toogle render
        </button>
      </div>
    </section>
  );
});

export const Issue1630 = component$(() => {
  const store = useStore({ open: true });

  return (
    <>
      <button id="toggle-child-slot" onClick$={() => (store.open = !store.open)}>
        Toggle Non-Slotted Content
      </button>
      <Slot name="slot-content" />
      {store.open && <Slot />}
    </>
  );
});

export const Child = component$((props: { id?: string }) => {
  return (
    <p id={props.id}>
      <Slot />
    </p>
  );
});

export const Issue1410 = component$(() => {
  const store = useStore({ open: true });

  return (
    <>
      <button id="toggle-modal" onClick$={() => (store.open = !store.open)}>
        Toggle modal
      </button>
      {store.open && (
        <>
          <Child>
            <Slot />
          </Child>
        </>
      )}
    </>
  );
});

export const Projector = component$((props: { state: any; id: string }) => {
  return (
    <div
      id={props.id}
      onClick$={() => {
        props.state.count--;
      }}
    >
      <Button>
        <Slot name="start"></Slot>

        {!props.state.disableButtons && (
          <div>
            <Slot />
          </div>
        )}
        <Slot name="end" />
      </Button>
    </div>
  );
});

export const Button = component$((props: { id?: string }) => {
  return (
    <button type="button" id={props.id}>
      <Slot />
    </button>
  );
});

export const Thing = component$((props: { state: any; id: string }) => {
  return (
    <article class="todoapp" id={props.id}>
      {!props.state.disableNested && <Slot />}
    </article>
  );
});

export const Switch = component$((props: { name: string }) => {
  return <Slot name={props.name} />;
});

export const Issue2688 = component$(({ count }: { count: number }) => {
  const store = useStore({ flip: false });

  return (
    <>
      <button id="issue-2688-button" onClick$={() => (store.flip = !store.flip)}>
        Toggle switch
      </button>
      <div id="issue-2688-result">
        <Switch name={store.flip ? 'b' : 'a'}>
          <div q:slot="a">Alpha {count}</div>
          <div q:slot="b">Bravo {count}</div>
        </Switch>
      </div>
    </>
  );
});

const Issue2751Context = createContextId<Signal<number>>('CleanupCounterContext');

export const Issue2751 = component$(() => {
  const signal = useSignal(0);
  useContextProvider(Issue2751Context, signal);

  return (
    <>
      <button
        id="issue-2751-toggle"
        onClick$={() => {
          signal.value++;
        }}
      >
        Toggle
      </button>
      <div id="issue-2751-result">
        {signal.value % 2 === 0 ? <CleanupA></CleanupA> : <div>Nothing</div>}
      </div>
    </>
  );
});

interface CleanupProps {
  slot?: boolean;
}
export const CleanupA = component$<CleanupProps>((props) => {
  return (
    <div>
      <Bogus />
      {props.slot && <Slot></Slot>}
    </div>
  );
});

export const Bogus = component$(() => {
  const signal = useContext(Issue2751Context);
  const count = signal.value;
  return (
    <div>
      Bogus {count} {signal.value} <span>{signal.value}</span>
    </div>
  );
});

const Issue3565Model = component$(() => {
  return (
    <div id="issue-3565-result">
      Own content
      <Slot></Slot>
    </div>
  );
});

export const Issue3565 = component$(({ model: Model }: any) => {
  return (
    <>
      <Model>
        <div>content projected</div>
      </Model>
    </>
  );
});

export const Issue3607 = component$(() => {
  const show = useSignal(false);
  return (
    <Issue3607Button
      loading={show.value}
      onClick$={() => {
        show.value = !show.value;
      }}
    >
      {show.value ? 'Loading...' : 'Load more'}
    </Issue3607Button>
  );
});

export const Issue3607Button = component$(({ onClick$ }: any) => {
  return (
    <>
      <button id="issue-3607-result" onClick$={onClick$} class="btn">
        <Slot />
      </button>
    </>
  );
});

const CTX = createContextId<Signal<any[]>>('content-Issue3727');

export const Issue3727 = component$(() => {
  const content = useSignal<any[]>([Issue3727ParentA, Issue3727ChildA]);
  useContextProvider(CTX, content);

  const contentsLen = content.value.length;
  let cmp: JSXNode | null = null;
  for (let i = contentsLen - 1; i >= 0; i--) {
    cmp = jsx(content.value[i], {
      children: cmp,
    });
  }
  return cmp;
});

export const Issue3727ParentA = component$(() => {
  return (
    <main id="Issue3727ParentA">
      <Slot />
    </main>
  );
});

export const Issue3727ParentB = component$(() => {
  return (
    <main id="Issue3727ParentB">
      <Slot />
    </main>
  );
});

export const Issue3727ChildA = component$(() => {
  const content = useContext(CTX);

  return (
    <article>
      <h1>First</h1>
      <button
        id="issue-3727-navigate"
        onClick$={() => {
          content.value = [Issue3727ParentB, Issue3727ChildB];
        }}
      >
        Navigate
      </button>
    </article>
  );
});

export const Issue3727ChildB = component$(() => {
  const copyList = useSignal<string[]>([]);
  const content = useContext(CTX);
  return (
    <article>
      <h1>Second</h1>
      <button
        id="issue-3727-add"
        onClick$={async () => {
          content.value = [Issue3727ParentB, Issue3727ChildB];
          copyList.value = [...copyList.value, `item ${copyList.value.length}`];
        }}
      >
        Add item
      </button>
      <ul id="issue-3727-results">
        {copyList.value.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
    </article>
  );
});
