// Import our shared jest setup
import '../../../setup-jest';

// Importing presets and extensions
import 'jest-preset-angular/setup-jest';

// Now import additional global mocks for the project
import './jest-global-mocks';

// Load FontAwesome icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);
