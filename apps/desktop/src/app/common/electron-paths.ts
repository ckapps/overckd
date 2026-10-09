import { Context, Layer } from 'effect';
import { app } from 'electron';

/** The directories Electron keeps for the app. */
export class ElectronPaths extends Context.Service<
  ElectronPaths,
  {
    /** The app's own directory, the default app directory */
    readonly userData: string;
    /** Where the app writes its log */
    readonly logs: string;
  }
>()('@overckd/desktop/ElectronPaths') {
  static readonly layer = Layer.sync(ElectronPaths)(() =>
    ElectronPaths.of({
      userData: app.getPath('userData'),
      logs: app.getPath('logs'),
    }),
  );
}
