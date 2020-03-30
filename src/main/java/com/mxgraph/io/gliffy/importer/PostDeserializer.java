package com.mxgraph.io.gliffy.importer;

import java.io.IOException;

import com.google.gson.Gson;
import com.google.gson.TypeAdapter;
import com.google.gson.TypeAdapterFactory;
import com.google.gson.reflect.TypeToken;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;

/**
 * Enables post deserialization for classes that implement {@link PostDeserializer.PostDeserializable}
 */
public class PostDeserializer implements TypeAdapterFactory {
    public interface PostDeserializable {
        void postDeserialize();
    }

    public <T> TypeAdapter<T> create(Gson gson, TypeToken<T> type) {
        final TypeAdapter<T> delegate = gson.getDelegateAdapter(this, type);

        return new TypeAdapter<T>() {
            public void write(JsonWriter out, T value) throws IOException {
                delegate.write(out, value);
            }

            public T read(JsonReader in) throws IOException {
                T obj = delegate.read(in);
                if (obj instanceof PostDeserializable) {
                    ((PostDeserializable)obj).postDeserialize();
                }
                return obj;
            }
        };
    }
}