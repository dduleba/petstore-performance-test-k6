import http from 'k6/http';
import { group, check, sleep } from 'k6';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { checkStatus } from '../modules/helpers.js';
// import { BASE_URL, STRESS_TEST_OPTIONS } from
