#!/bin/bash

# Set up directory structure
mkdir -p certificates/{root-ca,intermediate-ca,server,client}
cd certificates

# Generate Root CA private key and certificate
echo "Generating Root CA..."
openssl genrsa -out root-ca/root-ca.key 4096

cat > root-ca/root-ca.conf << EOF
[req]
distinguished_name = req_distinguished_name
prompt = no
x509_extensions = v3_ca

[req_distinguished_name]
C = US
ST = State
L = City
O = Your Organization Root CA
CN = Your Root CA

[v3_ca]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true
keyUsage = critical, digitalSignature, cRLSign, keyCertSign
EOF

openssl req -x509 -new -nodes \
    -key root-ca/root-ca.key \
    -sha256 -days 3650 \
    -config root-ca/root-ca.conf \
    -out root-ca/root-ca.crt

# Generate Intermediate CA
echo "Generating Intermediate CA..."
openssl genrsa -out intermediate-ca/intermediate-ca.key 4096

cat > intermediate-ca/intermediate-ca.conf << EOF
[req]
distinguished_name = req_distinguished_name
prompt = no
x509_extensions = v3_ca

[req_distinguished_name]
C = US
ST = State
L = City
O = Your Organization Intermediate CA
CN = Your Intermediate CA

[v3_ca]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true, pathlen:0
keyUsage = critical, digitalSignature, cRLSign, keyCertSign
EOF

# Generate Intermediate CA CSR
openssl req -new \
    -key intermediate-ca/intermediate-ca.key \
    -config intermediate-ca/intermediate-ca.conf \
    -out intermediate-ca/intermediate-ca.csr

# Sign Intermediate CA certificate with Root CA
openssl x509 -req \
    -in intermediate-ca/intermediate-ca.csr \
    -CA root-ca/root-ca.crt \
    -CAkey root-ca/root-ca.key \
    -CAcreateserial \
    -out intermediate-ca/intermediate-ca.crt \
    -days 1825 \
    -sha256 \
    -extfile intermediate-ca/intermediate-ca.conf \
    -extensions v3_ca

# Generate Server Certificate
echo "Generating Server Certificate..."
openssl genrsa -out server/server.key 2048

cat > server/server.conf << EOF
[req]
distinguished_name = req_distinguished_name
prompt = no
req_extensions = v3_req

[req_distinguished_name]
C = US
ST = State
L = City
O = Your Organization
CN = localhost

[v3_req]
basicConstraints = CA:FALSE
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = 127.0.0.1
EOF

# Generate Server CSR
openssl req -new \
    -key server/server.key \
    -config server/server.conf \
    -out server/server.csr

# Sign Server Certificate with Intermediate CA
openssl x509 -req \
    -in server/server.csr \
    -CA intermediate-ca/intermediate-ca.crt \
    -CAkey intermediate-ca/intermediate-ca.key \
    -CAcreateserial \
    -out server/server.crt \
    -days 365 \
    -sha256 \
    -extfile server/server.conf \
    -extensions v3_req

# Generate Client Certificate
echo "Generating Client Certificate..."
openssl genrsa -out client/client.key 2048

cat > client/client.conf << EOF
[req]
distinguished_name = req_distinguished_name
prompt = no
req_extensions = v3_req

[req_distinguished_name]
C = US
ST = State
L = City
O = Your Organization
CN = API Client

[v3_req]
basicConstraints = CA:FALSE
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth
EOF

# Generate Client CSR
openssl req -new \
    -key client/client.key \
    -config client/client.conf \
    -out client/client.csr

# Sign Client Certificate with Intermediate CA
openssl x509 -req \
    -in client/client.csr \
    -CA intermediate-ca/intermediate-ca.crt \
    -CAkey intermediate-ca/intermediate-ca.key \
    -CAcreateserial \
    -out client/client.crt \
    -days 365 \
    -sha256 \
    -extfile client/client.conf \
    -extensions v3_req

# Create certificate chain file
cat intermediate-ca/intermediate-ca.crt root-ca/root-ca.crt > ca-chain.crt

# Verify certificates
echo "Verifying certificates..."
openssl verify -CAfile root-ca/root-ca.crt intermediate-ca/intermediate-ca.crt
openssl verify -CAfile ca-chain.crt server/server.crt
openssl verify -CAfile ca-chain.crt client/client.crt

# Copy certificates to the main directory
cp server/server.crt ../server.crt
cp server/server.key ../server.key
cp ca-chain.crt ../ca-chain.crt
cp client/client.crt ../client.crt
cp client/client.key ../client.key

echo "Certificate generation complete!"
echo
echo "Generated files:"
echo "1. Root CA:"
echo "   - certificates/root-ca/root-ca.crt"
echo "   - certificates/root-ca/root-ca.key"
echo
echo "2. Intermediate CA:"
echo "   - certificates/intermediate-ca/intermediate-ca.crt"
echo "   - certificates/intermediate-ca/intermediate-ca.key"
echo
echo "3. Server Certificate:"
echo "   - server.crt"
echo "   - server.key"
echo
echo "4. Client Certificate:"
echo "   - client.crt"
echo "   - client.key"
echo
echo "5. Certificate Chain:"
echo "   - ca-chain.crt"