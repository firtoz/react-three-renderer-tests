import React from 'react';
import THREE from 'three.js';
import ReactDOM from 'react-dom';

const WANTED_URL = 'https://avatars0.githubusercontent.com/u/860717?v=3&s=32';

module.exports = type => {
  const { testDiv, React3, mockConsole } = require('../utils/initContainer')(type);

  describe('TextureDescriptor', () => {
    class TestComponent extends React.Component {
      static propTypes = {
        url: React.PropTypes.string,
        done: React.PropTypes.func,
        onError: React.PropTypes.func,
      };

      _onTextureLoad = () => {
        this.props.done();
      };

      _onTextureError = () => {
        this.props.onError();
      };

      render() {
        return (<React3
          width={800}
          height={600}
        >
          <resources>
            <texture
              url={this.props.url}
              onLoad={this._onTextureLoad}
              onError={this._onTextureError}
              resourceId="textureRes"
            />
          </resources>
        </React3>);
      }
    }

    it('Should give an error when it cannot load', (done) => {
      const onError = () => {
        done();
      };

      ReactDOM.render((<TestComponent
        url="./bad.png"
        onError={onError}
      />), testDiv);

      mockConsole.expect('THREE.WebGLRenderer	73');
    });

    it('Should succeed when it can load', (done) => {
      ReactDOM.render((<TestComponent
        url="/base/assets/images/rgbw.png"
        done={done}
      />), testDiv);

      mockConsole.expect('THREE.WebGLRenderer	73');
    });

    it('Should succeed when it can load from cross origin', function _(done) {
      this.timeout(5000);

      mockConsole.expect('THREE.WebGLRenderer	73');

      ReactDOM.render((<TestComponent
        url={WANTED_URL}
        done={done}
      />), testDiv);
    });

    it('Should fail for cross origin images if crossOrigin is not set', function _(done) {
      this.timeout(5000);

      const onSceneCreate = (scene) => {
        if (!scene) {
          return;
        }

        const extensions = scene.userData.markup._rootInstance._renderer.extensions;

        mockConsole.revert();

        // need to do this to prevent logging during tests if the extensions don't exist
        extensions.get('WEBGL_compressed_texture_pvrtc');
        extensions.get('OES_texture_half_float');
        extensions.get('WEBGL_compressed_texture_s3tc');
        extensions.get('EXT_blend_minmax');

        mockConsole.apply();
      };

      mockConsole.expect('THREE.WebGLRenderer	73');

      ReactDOM.render((<React3
        width={800}
        height={600}
        mainCamera="mainCamera"
      >
        <scene
          ref={onSceneCreate}
        >
          <perspectiveCamera
            position={new THREE.Vector3(0, 0, 5)}
            fov={75}
            aspect={800 / 600}
            near={0.1}
            far={1000}
            name="mainCamera"
          />
          <mesh>
            <boxGeometry
              width={2}
              height={2}
              depth={2}
            />
            <meshBasicMaterial
              color={0xff0000}
            >
              <texture
                url={WANTED_URL}
              />
            </meshBasicMaterial>
          </mesh>
        </scene>
      </React3>), testDiv);

      mockConsole.expect(`SecurityError: Failed to execute 'texImage2D'` +
        ` on 'WebGLRenderingContext': ` +
        `The cross-origin image at ${WANTED_URL}` +
        ` may not be loaded.`);

      mockConsole.once('empty', () => {
        done();
      });
    });

    it('Should not fail for cross origin images if crossOrigin is set', function _(done) {
      this.timeout(5000);

      mockConsole.expect('THREE.WebGLRenderer	73');

      const onSceneCreate = (scene) => {
        if (!scene) {
          return;
        }

        const extensions = scene.userData.markup._rootInstance._renderer.extensions;

        mockConsole.revert();

        // need to do this to prevent logging during tests if the extensions don't exist
        extensions.get('WEBGL_compressed_texture_pvrtc');
        extensions.get('OES_texture_half_float');
        extensions.get('WEBGL_compressed_texture_s3tc');
        extensions.get('EXT_blend_minmax');

        mockConsole.apply();

        mockConsole.expect('texture has loaded');
        mockConsole.expect('fin');
      };

      const textureLoaded = () => {
        mockConsole.log('texture has loaded');

        // wait a second before being done
        setTimeout(() => {
          mockConsole.log('fin');

          done();
        }, 1000);
      };

      ReactDOM.render((<React3
        width={800}
        height={600}
        mainCamera="mainCamera"
      >
        <scene
          ref={onSceneCreate}
        >
          <perspectiveCamera
            position={new THREE.Vector3(0, 0, 5)}
            fov={75}
            aspect={800 / 600}
            near={0.1}
            far={1000}
            name="mainCamera"
          />
          <mesh>
            <boxGeometry
              width={2}
              height={2}
              depth={2}
            />
            <meshBasicMaterial
              color={0xff0000}
            >
              <texture
                url={WANTED_URL}
                crossOrigin=""
                onLoad={textureLoaded}
              />
            </meshBasicMaterial>
          </mesh>
        </scene>
      </React3>), testDiv);
    });
  });
};
