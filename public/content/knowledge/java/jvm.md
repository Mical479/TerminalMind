# JVM (Java Virtual Machine)

## Architecture Overview

```
┌─────────────────────────────────────┐
│         Class Loader Subsystem       │
├─────────────────────────────────────┤
│              Runtime Area            │
│  ┌──────┐ ┌──────┐ ┌──────────────┐ │
│  │Method│ │ Heap │ │   Stack      │ │
│  │ Area │ │      │ │   (per       │ │
│  │      │ │      │ │   thread)    │ │
│  └──────┘ └──────┘ └──────────────┘ │
├─────────────────────────────────────┤
│         Execution Engine            │
│  ┌────────┐ ┌───────┐ ┌──────────┐  │
│  │Interpreter│ │JIT   │ │GC       │  │
│  │         │ │Compiler│ │         │  │
│  └────────┘ └───────┘ └──────────┘  │
└─────────────────────────────────────┘
```

## Memory Areas

### Heap
- Stores objects and arrays
- Shared across all threads
- Garbage collected

### Stack (per thread)
- Stores method frames
- Local variables
- Operand stacks
- Reference to heap objects

### Method Area
- Class metadata
- Static fields
- Constant pool
- JIT compiled code

## Garbage Collection

### GC Generations

| Generation | Description |
|------------|-------------|
| Young (Eden) | New objects, minor GC |
| Survivor | Objects surviving minor GC |
| Old Gen | Long-lived objects, major GC |

### Common GC Algorithms

1. **Serial GC** - Single thread, stop-the-world
2. **Parallel GC** - Multiple threads, stop-the-world
3. **CMS (Concurrent Mark Sweep)** - Concurrent, low latency
4. **G1 (Garbage First)** - Region-based, predictable pauses
5. **ZGC** - Scalable, ultra-low latency

### G1 GC Process

1. Young Collection - Eden → Survivor
2. Mixed Collection - Young + Old regions
3. Marking - Concurrent global marking

## Class Loader

### Delegation Model

```
Bootstrap CL → Extension CL → Application CL
     ↑              ↑              ↓
     └──────────────┴──────────────┘
              (parent first)
```

### Types

1. **Bootstrap ClassLoader** - JVM core classes (rt.jar)
2. **Extension ClassLoader** - ext/*.jar
3. **Application ClassLoader** - classpath

## JIT Compilation

- Hot methods compiled to native code
- Compilation happens after threshold reached
- Two tiers: C1 (client) and C2 (server)
