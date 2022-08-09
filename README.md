# jVectorMap World Province

## Features

- [Hearts of Iron IV Map](https://github.com/Ferhatduran55/jvectormap-world/blob/master/map.png?raw=true)

## APIs
### Local APIs

| API | Description |
| - | - |
| core | Parse and return data from global API for country details |
| language | Return language |
| port | Returns required connection information for socket connection |
| time | Returns the current time |

### Global APIs

| API | Description |
| - | - |
| country | Returns country details corresponding to data sent to https://restcountries.com/v3.1/alpha |
| translate | Returns the translated word based on data sent to https://portal.ayfie.com/api/translate |

## Components

- php`@7.4.26`
- node`@16.16.0`
- npm`@8.11.0`
- composer`@2.3.10`

## Node Modules

- dotenv`@16.0.1`
- express`@4.18.1`
- isset-php`@1.0.7`
- pm2`@5.2.0`
- socket.io-client`@2.5.0`
- socket.io`@4.5.1`
- xmlhttprequest`@1.8.0`

## Php Modules

- graham-campbell/result-type`@1.1.0`
- phpmailer/phpmailer`@6.6.3`
- symfony/polyfill-ctype`@1.26.0`
- symfony/polyfill-mbstring`@1.26.0`
- symfony/polyfill-php80`@1.26.0`
- vlucas/phpdotenv`@5.4.1`
- workerman/channel`@1.1.0`
- workerman/phpsocket.io`@1.1.14`
- workerman/workerman`@4.0.42`

## Assets

- jquery`@3.6.0`
- bootstrap`@5.2.0`
- jvectormap`@2.0.5`
- requirejs`@2.3.6`
- _main`@latest`_

## Environment Variables
### Local Variables

| Variable | Value |
| - | - |
| HOSTNAME | "localhost" |
| IP | "127.0.0.1" |

### Workerman Variables

### Workerman Port Variables

| Variable | Value |
| - | - |
| WKM_HTTPS_PORT | 3002 |
| WKM_HTTP_PORT | 3003 |

### IO Variables

| Variable | Value |
| - | - |
| IO_PING_INTERVAL | 3000 |
| IO_PING_TIMEOUT | 5000 |
| IO_CONNECT_TIMEOUT | 45000 |
| IO_ALLOW_UPGRADES | true |
| IO_UPGRADE_TIMEOUT | 10000 |
| IO_MAX_HTTP_BUFFER_SIZE | 1000000 |
| IO_HTTP_COMPRESSION | true |

### IO Cors Variables

| Variable | Value |
| - | - |
| IO_CORS_ORIGIN | "*" |
| IO_CORS_ALLOWED_HEADERS | ["access"] |
| IO_CORS_CREDENTIALS | true |

### Protocol Variables

| Variable | Value |
| - | - |
| PROTOCOL | 2 |

### IO Port Variables

| Variable | Value |
| - | - |
| IO_HTTPS_PORT | 3000 |
| IO_HTTP_PORT | 3001 |

### API Variables

| Variable | Value |
| - | - |
| X_API_KEY | "bKDUjcnKWnEgwoICmjxrQsMNLsXbPQekrxiNSueQnBnFQUsQkn"
