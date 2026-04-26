vec3 transformed = vec3(position);

transformed.xz = transformed.xz * rotateMatrix;

#ifdef USE_ALPHAHASH

vPosition = vec3(position);
vPosition.y += 10.0;

#endif