// SPDX-License-Identifier: Apache-2.0

import { Buffer } from 'buffer';

globalThis.process = globalThis.process ?? { env: {} };
globalThis.Buffer = Buffer;
